"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getUnusedCredit } from "@/lib/templates";
import { defaultExpiry, extendedExpiry } from "@/lib/constants";
import { generateProjectSlug } from "@/lib/slug";
import {
  createFromTemplateSchema,
  eventSchema,
  galleryImageSchema,
  projectSchema,
  type CreateFromTemplateInput,
} from "@/lib/validations";

export type ActionState = { error?: string; success?: boolean };

/** Loads a project only if it belongs to the current user. */
async function requireOwnedProject(projectId: string) {
  const user = await requireUser();
  const project = await prisma.weddingProject.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) throw new Error("Project not found");
  return project;
}

/**
 * Creates a fully filled-in invitation from a template in one shot — the payload
 * from the multi-step wizard. Consumes one unused invitation credit for that
 * template (binding it to the new project), writes the project plus its events
 * and gallery, and — if published now — locks the couple's identity and sets an
 * expiry. Redirects to the project page.
 */
export async function createProjectFromTemplateAction(
  _prev: ActionState,
  input: CreateFromTemplateInput,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = createFromTemplateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const theme = await prisma.theme.findUnique({ where: { slug: d.templateSlug } });
  if (!theme || !theme.isListed) return { error: "That template is not available" };

  const credit = await getUnusedCredit(user.id, theme.id);
  if (!credit) {
    return { error: "You don't have an invitation credit for this template. Get one from the templates page." };
  }

  const slug = await generateProjectSlug(d.groomName, d.brideName);
  const weddingDate = new Date(d.weddingDate);

  let projectId: string;
  try {
    projectId = await prisma.$transaction(async (tx) => {
      const project = await tx.weddingProject.create({
        data: {
          userId: user.id,
          slug,
          themeId: theme.id,
          brideName: d.brideName,
          groomName: d.groomName,
          weddingDate,
          title: d.title?.trim() || `The Wedding of ${d.groomName} & ${d.brideName}`,
          quote: d.quote?.trim() || null,
          story: d.story?.trim() || null,
          coverImageUrl: d.coverImageUrl || null,
          musicUrl: d.musicUrl || null,
          giftQrUrl: d.giftQrUrl || null,
          giftDetails: d.giftDetails?.trim() || null,
          showGift: d.showGift ?? true,
          showGiftQr: d.showGiftQr ?? true,
          contactName1: d.contactName1?.trim() || null,
          contactPhone1: d.contactPhone1?.trim() || null,
          contactName2: d.contactName2?.trim() || null,
          contactPhone2: d.contactPhone2?.trim() || null,
          showContact: d.showContact ?? true,
          isPublished: d.publish,
          lockedAt: d.publish ? new Date() : null,
          expiresAt: d.publish ? defaultExpiry(weddingDate) : null,
          events: {
            create: d.events.map((e, order) => ({
              title: e.title,
              description: e.description || null,
              eventDate: new Date(e.eventDate),
              startTime: e.startTime || null,
              endTime: e.endTime || null,
              venueName: e.venueName,
              address: e.address,
              mapUrl: e.mapUrl || null,
              wazeUrl: e.wazeUrl || null,
              order,
            })),
          },
          gallery: {
            create: d.gallery.map((g, order) => ({
              imageUrl: g.imageUrl,
              caption: g.caption || null,
              order,
            })),
          },
        },
      });

      // Consume the credit. `updateMany` with the null guard makes this a no-op
      // if the credit was consumed concurrently, which we then reject below.
      const consumed = await tx.templatePurchase.updateMany({
        where: { id: credit.id, projectId: null },
        data: { projectId: project.id },
      });
      if (consumed.count !== 1) throw new Error("CREDIT_RACE");

      return project.id;
    });
  } catch (e) {
    if (e instanceof Error && e.message === "CREDIT_RACE") {
      return { error: "That invitation credit was just used. Please try again." };
    }
    throw e;
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function updateProjectAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const project = await requireOwnedProject(projectId);
  const parsed = projectSchema.safeParse({
    brideName: formData.get("brideName"),
    groomName: formData.get("groomName"),
    weddingDate: formData.get("weddingDate"),
    title: formData.get("title") ?? undefined,
    quote: formData.get("quote") ?? undefined,
    story: formData.get("story") ?? undefined,
    coverImageUrl: formData.get("coverImageUrl") ?? undefined,
    musicUrl: formData.get("musicUrl") ?? undefined,
    giftDetails: formData.get("giftDetails") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  // Once locked (first publish), the couple's identity is frozen — a different
  // wedding needs a new invitation. Content fields stay editable. Compare the
  // date at day resolution: the form's date input has no time-of-day, so an
  // exact-timestamp compare would falsely trip for any non-midnight wedding.
  const locked = project.lockedAt !== null;
  const sameDay = d.weddingDate === project.weddingDate.toISOString().slice(0, 10);
  const identityChanged =
    d.brideName !== project.brideName || d.groomName !== project.groomName || !sameDay;
  if (locked && identityChanged) {
    return {
      error:
        "Names and wedding date are locked once an invitation is published. Create a new invitation for a different wedding.",
    };
  }

  const str = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  const bool = (k: string) => formData.get(k) === "on";

  await prisma.weddingProject.update({
    where: { id: projectId },
    data: {
      brideName: locked ? project.brideName : d.brideName,
      groomName: locked ? project.groomName : d.groomName,
      // Keep the stored timestamp (with its time-of-day) unless the day changed.
      weddingDate: locked || sameDay ? project.weddingDate : new Date(d.weddingDate),
      title: d.title || null,
      quote: d.quote || null,
      story: d.story || null,
      // The cover field may be hidden for some templates — keep the stored value
      // when it isn't submitted rather than wiping it.
      coverImageUrl:
        formData.get("coverImageUrl") === null ? project.coverImageUrl : d.coverImageUrl || null,
      musicUrl: d.musicUrl || null,
      giftDetails: d.giftDetails || null,
      giftQrUrl: str("giftQrUrl"),
      showGift: bool("showGift"),
      showGiftQr: bool("showGiftQr"),
      contactName1: str("contactName1"),
      contactPhone1: str("contactPhone1"),
      contactName2: str("contactName2"),
      contactPhone2: str("contactPhone2"),
      showContact: bool("showContact"),
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function setPublishedAction(projectId: string, publish: boolean): Promise<ActionState> {
  const project = await requireOwnedProject(projectId);

  if (publish && project.expiresAt && Date.now() > project.expiresAt.getTime()) {
    return { error: "This invitation has expired. Extend it before publishing again." };
  }

  const firstPublish = publish && project.lockedAt === null;
  await prisma.weddingProject.update({
    where: { id: projectId },
    data: {
      isPublished: publish,
      ...(firstPublish
        ? { lockedAt: new Date(), expiresAt: defaultExpiry(project.weddingDate) }
        : {}),
    },
  });
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/invite/${project.slug}`);
  return { success: true };
}

/**
 * Extend a live/expired invitation's public window by one period. No payment
 * gateway yet, so this is granted immediately; a Payment row is written for the
 * record so a real gateway can slot in here later.
 */
export async function extendInvitationAction(projectId: string): Promise<ActionState> {
  const user = await requireUser();
  const project = await prisma.weddingProject.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return { error: "Project not found" };

  const nextExpiry = extendedExpiry(project.expiresAt);
  await prisma.$transaction([
    prisma.weddingProject.update({
      where: { id: projectId },
      data: { expiresAt: nextExpiry },
    }),
    prisma.payment.create({
      data: { userId: user.id, projectId, amount: 0, provider: "manual-extension", status: "PAID" },
    }),
  ]);

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/invite/${project.slug}`);
  return { success: true };
}

export async function deleteProjectAction(projectId: string) {
  await requireOwnedProject(projectId);
  await prisma.weddingProject.delete({ where: { id: projectId } });
  redirect("/dashboard");
}

export async function addEventAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwnedProject(projectId);
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    eventDate: formData.get("eventDate"),
    startTime: formData.get("startTime") ?? undefined,
    endTime: formData.get("endTime") ?? undefined,
    venueName: formData.get("venueName"),
    address: formData.get("address"),
    mapUrl: formData.get("mapUrl") ?? undefined,
    wazeUrl: formData.get("wazeUrl") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  const count = await prisma.weddingEvent.count({ where: { projectId } });
  await prisma.weddingEvent.create({
    data: {
      projectId,
      title: d.title,
      description: d.description || null,
      eventDate: new Date(d.eventDate),
      startTime: d.startTime || null,
      endTime: d.endTime || null,
      venueName: d.venueName,
      address: d.address,
      mapUrl: d.mapUrl || null,
      wazeUrl: d.wazeUrl || null,
      order: count,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  return { success: true };
}

export async function updateEventAction(
  projectId: string,
  eventId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireOwnedProject(projectId);
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    eventDate: formData.get("eventDate"),
    startTime: formData.get("startTime") ?? undefined,
    endTime: formData.get("endTime") ?? undefined,
    venueName: formData.get("venueName"),
    address: formData.get("address"),
    mapUrl: formData.get("mapUrl") ?? undefined,
    wazeUrl: formData.get("wazeUrl") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  await prisma.weddingEvent.updateMany({
    where: { id: eventId, projectId },
    data: {
      title: d.title,
      description: d.description || null,
      eventDate: new Date(d.eventDate),
      startTime: d.startTime || null,
      endTime: d.endTime || null,
      venueName: d.venueName,
      address: d.address,
      mapUrl: d.mapUrl || null,
      wazeUrl: d.wazeUrl || null,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  return { success: true };
}

/** Swap this event's order with its neighbour, to arrange the running order. */
export async function moveEventAction(projectId: string, eventId: string, dir: "up" | "down") {
  await requireOwnedProject(projectId);
  const events = await prisma.weddingEvent.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });
  const i = events.findIndex((e) => e.id === eventId);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= events.length) return;

  await prisma.$transaction([
    prisma.weddingEvent.update({ where: { id: events[i].id }, data: { order: events[j].order } }),
    prisma.weddingEvent.update({ where: { id: events[j].id }, data: { order: events[i].order } }),
  ]);
  revalidatePath(`/dashboard/projects/${projectId}/editor`);
}

export async function deleteEventAction(projectId: string, eventId: string) {
  await requireOwnedProject(projectId);
  await prisma.weddingEvent.deleteMany({ where: { id: eventId, projectId } });
  revalidatePath(`/dashboard/projects/${projectId}/editor`);
}

export async function addGalleryImageAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwnedProject(projectId);
  const parsed = galleryImageSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const count = await prisma.galleryImage.count({ where: { projectId } });
  await prisma.galleryImage.create({
    data: {
      projectId,
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption || null,
      order: count,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/gallery`);
  return { success: true };
}

export async function deleteGalleryImageAction(projectId: string, imageId: string) {
  await requireOwnedProject(projectId);
  await prisma.galleryImage.deleteMany({ where: { id: imageId, projectId } });
  revalidatePath(`/dashboard/projects/${projectId}/gallery`);
}

export async function toggleWishVisibilityAction(projectId: string, wishId: string, isVisible: boolean) {
  await requireOwnedProject(projectId);
  await prisma.guestWish.updateMany({ where: { id: wishId, projectId }, data: { isVisible } });
  revalidatePath(`/dashboard/projects/${projectId}/wishes`);
}
