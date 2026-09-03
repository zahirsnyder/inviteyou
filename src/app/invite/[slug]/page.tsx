import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { isExpired } from "@/lib/constants";
import { getFeatures } from "@/lib/templateFeatures";
import type { InvitationContact } from "@/components/invitation/types";

function buildContacts(p: {
  contactName1: string | null;
  contactPhone1: string | null;
  contactName2: string | null;
  contactPhone2: string | null;
}): InvitationContact[] {
  return [
    { name: p.contactName1, phone: p.contactPhone1 },
    { name: p.contactName2, phone: p.contactPhone2 },
  ]
    .filter((c) => c.phone?.trim())
    .map((c) => ({ name: c.name?.trim() || "Contact", phone: c.phone!.trim() }));
}
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { InvitationEnded } from "@/components/invitation/InvitationEnded";
import type { InvitationData } from "@/components/invitation/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string; preview?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.weddingProject.findUnique({
    where: { slug },
    select: { title: true, groomName: true, brideName: true, isPublished: true, expiresAt: true },
  });
  if (!project || !project.isPublished || isExpired(project.expiresAt)) {
    return { title: "Invitation", robots: { index: false, follow: false } };
  }
  return {
    title: project.title ?? `The Wedding of ${project.groomName} & ${project.brideName}`,
    description: `You are warmly invited to the wedding of ${project.groomName} & ${project.brideName}.`,
  };
}

export default async function InvitePage({ params, searchParams }: Props) {
  const [{ slug }, { src, preview }] = await Promise.all([params, searchParams]);

  const project = await prisma.weddingProject.findUnique({
    where: { slug },
    include: {
      theme: { select: { slug: true } },
      purchase: { select: { status: true } },
      events: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      wishes: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!project) notFound();

  // Admin preview mode: the owner may view an unpublished draft with ?preview=1.
  const isDraftPreview = !project.isPublished;
  const isOwnerPreview = preview === "1" && (await getSessionUserId()) === project.userId;
  if (isDraftPreview && !isOwnerPreview) notFound();

  // A live invitation stops showing to guests once it passes its expiry date.
  if (isExpired(project.expiresAt) && !isOwnerPreview) {
    return <InvitationEnded groomName={project.groomName} brideName={project.brideName} />;
  }

  // Basic analytics: record the visit (QR_SCAN when arriving via the QR code
  // link). Previews are not counted.
  if (!isDraftPreview && preview !== "1") {
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
  }

  const data: InvitationData = {
    slug: project.slug,
    watermark: project.purchase?.status !== "PAID",
    groomName: project.groomName,
    brideName: project.brideName,
    title: project.title,
    quote: project.quote,
    story: project.story,
    weddingDateISO: project.weddingDate.toISOString(),
    coverImageUrl: project.coverImageUrl,
    musicUrl: project.musicUrl,
    themeSlug: project.theme?.slug ?? "dark-cinematic-gold",
    features: getFeatures(project.theme?.slug ?? "dark-cinematic-gold"),
    giftQrUrl: project.giftQrUrl,
    giftDetails: project.giftDetails,
    showGift: project.showGift,
    showGiftQr: project.showGiftQr,
    contacts: project.showContact ? buildContacts(project) : [],
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
      wazeUrl: e.wazeUrl,
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

  return (
    <>
      {isDraftPreview && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] rounded-full border border-amber-400/50 bg-amber-950/80 backdrop-blur-sm px-5 py-2 text-amber-200 text-xs tracking-widest uppercase">
          Draft preview — only you can see this
        </div>
      )}
      <InvitationRenderer data={data} />
    </>
  );
}
