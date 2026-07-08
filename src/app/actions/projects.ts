"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { generateProjectSlug } from "@/lib/slug";
import { eventSchema, galleryImageSchema, projectSchema } from "@/lib/validations";

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

export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = projectSchema.safeParse({
    brideName: formData.get("brideName"),
    groomName: formData.get("groomName"),
    weddingDate: formData.get("weddingDate"),
    title: formData.get("title") ?? undefined,
    quote: formData.get("quote") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { brideName, groomName, weddingDate, title, quote } = parsed.data;
  const slug = await generateProjectSlug(groomName, brideName);
  const defaultTheme = await prisma.theme.findUnique({ where: { slug: "dark-cinematic-gold" } });

  const project = await prisma.weddingProject.create({
    data: {
      userId: user.id,
      slug,
      brideName,
      groomName,
      title: title || `The Wedding of ${groomName} & ${brideName}`,
      quote: quote || null,
      weddingDate: new Date(weddingDate),
      themeId: defaultTheme?.id,
    },
  });

  redirect(`/dashboard/projects/${project.id}`);
}

export async function updateProjectAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwnedProject(projectId);
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
  await prisma.weddingProject.update({
    where: { id: projectId },
    data: {
      brideName: d.brideName,
      groomName: d.groomName,
      weddingDate: new Date(d.weddingDate),
      title: d.title || null,
      quote: d.quote || null,
      story: d.story || null,
      coverImageUrl: d.coverImageUrl || null,
      musicUrl: d.musicUrl || null,
      giftDetails: d.giftDetails || null,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function setPublishedAction(projectId: string, publish: boolean) {
  const project = await requireOwnedProject(projectId);
  await prisma.weddingProject.update({
    where: { id: projectId },
    data: { isPublished: publish },
  });
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/invite/${project.slug}`);
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
      order: count,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  return { success: true };
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
