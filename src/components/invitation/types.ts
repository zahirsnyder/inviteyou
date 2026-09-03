import type { TemplateFeatures } from "@/lib/templateFeatures";

export type InvitationEvent = {
  id: string;
  title: string;
  description: string | null;
  eventDateISO: string;
  startTime: string | null;
  endTime: string | null;
  venueName: string;
  address: string;
  mapUrl: string | null;
  wazeUrl: string | null;
};

export type InvitationWish = {
  id: string;
  name: string;
  message: string;
  createdAtISO: string;
};

export type InvitationGalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

export type InvitationContact = { name: string; phone: string };

export type InvitationData = {
  slug: string;
  /** Show a "made with InviteYou" badge (unpaid / preview invitations). */
  watermark: boolean;
  groomName: string;
  brideName: string;
  title: string | null;
  quote: string | null;
  story: string | null;
  weddingDateISO: string;
  coverImageUrl: string | null;
  musicUrl: string | null;
  themeSlug: string;
  /** Sections this template supports — renderers gate optional blocks on it. */
  features: TemplateFeatures;
  // Gift / money
  giftQrUrl: string | null;
  giftDetails: string | null;
  showGift: boolean;
  showGiftQr: boolean;
  // Contacts (already filtered to the visible, non-empty ones)
  contacts: InvitationContact[];
  events: InvitationEvent[];
  gallery: InvitationGalleryImage[];
  wishes: InvitationWish[];
};
