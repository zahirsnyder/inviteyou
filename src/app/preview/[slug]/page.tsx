import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/lib/templates";
import { getFeatures } from "@/lib/templateFeatures";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import type { InvitationData } from "@/components/invitation/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Template preview",
  robots: { index: false, follow: false },
};

/**
 * Live demo of a template: the sample invitation content rendered with the
 * requested template's look. Linked from the marketplace "View live demo".
 */
export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const template = await getTemplate(slug);
  if (!template) notFound();

  const project = await prisma.weddingProject.findFirst({
    where: { slug: "zahir-nisa" },
    include: {
      events: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      wishes: { where: { isVisible: true }, orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
  if (!project) notFound();

  const data: InvitationData = {
    slug: `preview-${slug}`,
    watermark: true,
    groomName: project.groomName,
    brideName: project.brideName,
    title: project.title,
    quote: project.quote,
    story: project.story,
    weddingDateISO: project.weddingDate.toISOString(),
    coverImageUrl: project.coverImageUrl,
    musicUrl: null, // no autoplay music in previews
    themeSlug: slug,
    features: getFeatures(slug),
    giftQrUrl: project.giftQrUrl,
    giftDetails: project.giftDetails,
    showGift: true,
    showGiftQr: true,
    contacts: [
      { name: "Zahir (Groom)", phone: "014-2773745" },
      { name: "Zakariah (Father)", phone: "019-7304880" },
    ],
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
    gallery: project.gallery.map((g) => ({ id: g.id, imageUrl: g.imageUrl, caption: g.caption })),
    wishes: project.wishes.map((w) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      createdAtISO: w.createdAt.toISOString(),
    })),
  };

  return <InvitationRenderer data={data} />;
}
