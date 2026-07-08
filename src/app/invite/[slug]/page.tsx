import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import type { InvitationData } from "@/components/invitation/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.weddingProject.findUnique({
    where: { slug },
    select: { title: true, groomName: true, brideName: true, isPublished: true },
  });
  if (!project || !project.isPublished) return { title: "Invitation" };
  return {
    title: project.title ?? `The Wedding of ${project.groomName} & ${project.brideName}`,
    description: `You are warmly invited to the wedding of ${project.groomName} & ${project.brideName}.`,
  };
}

export default async function InvitePage({ params, searchParams }: Props) {
  const [{ slug }, { src }] = await Promise.all([params, searchParams]);

  const project = await prisma.weddingProject.findUnique({
    where: { slug },
    include: {
      theme: { select: { slug: true } },
      events: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      wishes: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!project || !project.isPublished) notFound();

  // Basic analytics: record the visit (QR_SCAN when arriving via the QR code link).
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";
  const device = /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop";
  const referrer = headerList.get("referer");
  prisma.analyticsEvent
    .create({
      data: {
        projectId: project.id,
        eventType: src === "qr" ? "QR_SCAN" : "VISIT",
        device,
        referrer: referrer ?? "direct",
      },
    })
    .catch(() => {
      // Analytics must never break the invitation page.
    });

  const data: InvitationData = {
    slug: project.slug,
    groomName: project.groomName,
    brideName: project.brideName,
    title: project.title,
    quote: project.quote,
    story: project.story,
    weddingDateISO: project.weddingDate.toISOString(),
    coverImageUrl: project.coverImageUrl,
    musicUrl: project.musicUrl,
    giftQrUrl: project.giftQrUrl,
    giftDetails: project.giftDetails,
    themeSlug: project.theme?.slug ?? "dark-cinematic-gold",
    events: project.events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      eventDateISO: e.eventDate.toISOString(),
      startTime: e.startTime,
      endTime: e.endTime,
      venueName: e.venueName,
      address: e.address,
      mapUrl: e.mapUrl,
    })),
    gallery: project.gallery.map((g) => ({
      id: g.id,
      imageUrl: g.imageUrl,
      caption: g.caption,
    })),
    wishes: project.wishes.map((w) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      createdAtISO: w.createdAt.toISOString(),
    })),
  };

  return <InvitationRenderer data={data} />;
}
