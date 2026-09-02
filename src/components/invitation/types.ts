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
  giftQrUrl: string | null;
  giftDetails: string | null;
  themeSlug: string;
  events: InvitationEvent[];
  gallery: InvitationGalleryImage[];
  wishes: InvitationWish[];
};
