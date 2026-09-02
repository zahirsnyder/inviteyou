"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rsvpSchema, wishSchema } from "@/lib/validations";

export type PublicActionState = { error?: string; success?: boolean };

async function findPublishedProject(slug: string) {
  return prisma.weddingProject.findFirst({
    where: { slug, isPublished: true },
    select: { id: true, maxRsvp: true, rsvpDeadline: true },
  });
}

export async function submitRsvpAction(slug: string, _prev: PublicActionState, formData: FormData): Promise<PublicActionState> {
  const project = await findPublishedProject(slug);
  if (!project) return { error: "This invitation is not available" };

  if (project.rsvpDeadline && new Date() > project.rsvpDeadline) {
    return { error: "The RSVP deadline has passed" };
  }
  if (project.maxRsvp) {
    const count = await prisma.rsvp.count({ where: { projectId: project.id } });
    if (count >= project.maxRsvp) return { error: "RSVP is full for this event" };
  }

  const parsed = rsvpSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? undefined,
    attendance: formData.get("attendance"),
    paxCount: formData.get("paxCount") ?? 1,
    message: formData.get("message") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  await prisma.$transaction([
    prisma.rsvp.create({
      data: {
        projectId: project.id,
        name: d.name,
        phone: d.phone || null,
        attendance: d.attendance,
        paxCount: d.paxCount,
        message: d.message || null,
      },
    }),
    prisma.analyticsEvent.create({
      data: { projectId: project.id, eventType: "RSVP_SUBMIT" },
    }),
  ]);

  revalidatePath(`/invite/${slug}`);
  return { success: true };
}

export async function submitWishAction(slug: string, _prev: PublicActionState, formData: FormData): Promise<PublicActionState> {
  const project = await findPublishedProject(slug);
  if (!project) return { error: "This invitation is not available" };

  const parsed = wishSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.$transaction([
    prisma.guestWish.create({
      data: { projectId: project.id, name: parsed.data.name, message: parsed.data.message },
    }),
    prisma.analyticsEvent.create({
      data: { projectId: project.id, eventType: "WISH_SUBMIT" },
    }),
  ]);

  revalidatePath(`/invite/${slug}`);
  return { success: true };
}
