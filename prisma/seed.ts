import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultExpiry } from "../src/lib/constants";

const prisma = new PrismaClient();

const preview = (slug: string) => `/preview/${slug}`;
const IMG = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80`;

// The template the sample "zahir-nisa" invitation is built with.
const SAMPLE_THEME_SLUG = "sunset-terracotta";

// Venue + directions for the sample invitation (from the reference card).
const SAMPLE_VENUE = "The Alnia";
const SAMPLE_ADDRESS =
  "Lot 1356, Jalan Tanjung Syawal, Kampung Sungai Pinang, 41400 Klang, Selangor";
const SAMPLE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("The Alnia, Kampung Sungai Pinang, 41400 Klang, Selangor");
const SAMPLE_WAZE_URL =
  "https://waze.com/ul?q=" + encodeURIComponent("The Alnia, Klang, Selangor");

const themes = [
  {
    name: "Dark Cinematic Gold",
    slug: "dark-cinematic-gold",
    description:
      "A full-screen scroll-storytelling journey — dark romantic backdrop, gold accents, cinematic reveals scene by scene.",
    tagline: "Opens like a film — dark, gold, unforgettable.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: preview("dark-cinematic-gold"),
    previewImageUrl: IMG("photo-1519741497674-611481863552"),
    config: JSON.stringify({
      fontHeading: "Cormorant Garamond",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#c9a24b",
      secondaryColor: "#f5efe0",
      background: "cinematic dark",
      animationStyle: "cinematic",
    }),
  },
  {
    name: "Royal Malay Classic",
    slug: "royal-malay-classic",
    description:
      "Deep emerald and royal gold with Playfair Display headings — a regal, ceremonial feel.",
    tagline: "Regal emerald and gold, Playfair headings.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: preview("royal-malay-classic"),
    previewImageUrl: IMG("photo-1522673607200-164d1b6ce486"),
    config: JSON.stringify({
      fontHeading: "Playfair Display",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#d8b25a",
      secondaryColor: "#0c2a20",
      background: "deep emerald",
      animationStyle: "elegant",
    }),
  },
  {
    name: "Minimal Luxury White",
    slug: "minimal-luxury-white",
    description:
      "Airy ivory background, charcoal text, warm taupe accents and Libre Baskerville — quiet, editorial luxury.",
    tagline: "Quiet luxury — ivory, taupe, editorial serif.",
    isPremium: false,
    isListed: true,
    priceCents: 0,
    currency: "MYR",
    previewUrl: preview("minimal-luxury-white"),
    previewImageUrl: IMG("photo-1511285560929-80b456fea0bc"),
    config: JSON.stringify({
      fontHeading: "Libre Baskerville",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#b3946a",
      secondaryColor: "#2b2622",
      background: "light ivory",
      animationStyle: "minimal",
    }),
  },
  {
    name: "Garden Floral",
    slug: "garden-floral",
    description:
      "Deep olive backdrop with dusty-rose accents and EB Garamond — soft, botanical, romantic.",
    tagline: "Olive and dusty rose, EB Garamond.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: preview("garden-floral"),
    previewImageUrl: IMG("photo-1465495976277-4387d4b0b4c6"),
    config: JSON.stringify({
      fontHeading: "EB Garamond",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#cf90a4",
      secondaryColor: "#20241d",
      background: "botanical olive",
      animationStyle: "soft",
    }),
  },
  {
    name: "Botanical Heirloom",
    slug: "sunset-terracotta",
    description:
      "Classic Walimatulurus invitation featuring ornate gilded rococo framing, vintage botanical blossoms, warm ivory parchment, and interactive 3D perspective.",
    tagline: "Gilded Art Nouveau frames, vintage florals, timeless Malay elegance.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: preview("sunset-terracotta"),
    previewImageUrl: "/templates/botanical-heirloom/preview.jpg",
    config: JSON.stringify({
      fontHeading: "Playfair Display",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#c69a4c",
      secondaryColor: "#1a1614",
      background: "ivory parchment",
      animationStyle: "botanical-3d",
    }),
  },
  {
    name: "Midnight Sapphire",
    slug: "midnight-sapphire",
    description:
      "Deep navy background, cool silver-blue accents and Cormorant Garamond — a moonlit, modern classic.",
    tagline: "Deep navy and silver, moonlit and modern.",
    isPremium: true,
    isListed: true,
    priceCents: 4900,
    currency: "MYR",
    previewUrl: preview("midnight-sapphire"),
    previewImageUrl: IMG("photo-1519225421980-715cb0215aed"),
    config: JSON.stringify({
      fontHeading: "Cormorant Garamond",
      fontBody: "Plus Jakarta Sans",
      primaryColor: "#b9c2d6",
      secondaryColor: "#0e1626",
      background: "midnight navy",
      animationStyle: "serene",
    }),
  },
];

async function seedThemes() {
  console.log("Seeding themes…");
  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
  }
}

async function seedUsers() {
  console.log("Seeding accounts…");

  const owner = await prisma.user.upsert({
    where: { email: "zahirsnyder@gmail.com" },
    update: { name: "Zahir Snyder", role: "ADMIN" },
    create: {
      name: "Zahir Snyder",
      email: "zahirsnyder@gmail.com",
      password: await bcrypt.hash("zahirf12", 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@inviteyou.com" },
    update: {},
    create: {
      name: "Demo Couple",
      email: "demo@inviteyou.com",
      password: await bcrypt.hash("demo1234", 10),
      role: "CUSTOMER",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@inviteyou.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@inviteyou.com",
      password: await bcrypt.hash("admin1234", 10),
      role: "ADMIN",
    },
  });

  return owner;
}

/** Creates the sample "zahir-nisa" invitation once, then keeps its media fresh. */
async function ensureSampleProject(fallbackUserId: string) {
  const sampleTheme = await prisma.theme.findUniqueOrThrow({
    where: { slug: SAMPLE_THEME_SLUG },
  });

  const existing = await prisma.weddingProject.findUnique({ where: { slug: "zahir-nisa" } });
  if (existing) {
    await prisma.weddingProject.update({
      where: { id: existing.id },
      data: {
        coverImageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
        title: "The Wedding of Zahir & Nisa",
        quote:
          "With hearts full of gratitude, we warmly invite you and your family to celebrate this joyful day with us.",
        story:
          "Mr. & Mrs. Zakariah bin Abdul Aziz\n\nrequest the pleasure of your company at the wedding of their beloved son\n\nMuhamad Zahirudin\n&\nFitria Nisaq",
        // The reference card has no gift/payment section — just the venue,
        // a location QR (auto-generated from the map link) and contacts.
        giftDetails: null,
        giftQrUrl: null,
        showGift: false,
        showGiftQr: false,
        contactName1: "Zakariah (Father)",
        contactPhone1: "019-7304880",
        contactName2: "Zahir",
        contactPhone2: "014-2773745",
        showContact: true,
      },
    });
    await prisma.weddingEvent.updateMany({
      where: { projectId: existing.id },
      data: {
        venueName: SAMPLE_VENUE,
        address: SAMPLE_ADDRESS,
        mapUrl: SAMPLE_MAP_URL,
        wazeUrl: SAMPLE_WAZE_URL,
      },
    });
    await prisma.weddingEvent.updateMany({
      where: { projectId: existing.id, title: "Majlis Walimatul Urus" },
      data: { title: "Wedding Reception", description: "Lunch reception from 11:00 AM to 4:00 PM." },
    });
    const galleryCount = await prisma.galleryImage.count({ where: { projectId: existing.id } });
    if (galleryCount === 0) {
      await prisma.galleryImage.createMany({
        data: [
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", caption: "The proposal", order: 0 },
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80", caption: "Golden hour", order: 1 },
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", caption: "Our engagement", order: 2 },
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80", caption: "Hand in hand", order: 3 },
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", caption: "The celebration", order: 4 },
          { projectId: existing.id, imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80", caption: "First dance", order: 5 },
        ],
      });
    }
    return existing.id;
  }

  console.log("Seeding sample wedding project…");
  const project = await prisma.weddingProject.create({
    data: {
      userId: fallbackUserId,
      slug: "zahir-nisa",
      groomName: "Zahir",
      brideName: "Nisa",
      title: "The Wedding of Zahir & Nisa",
      quote:
        "With hearts full of gratitude, we warmly invite you and your family to celebrate this joyful day with us.",
      story:
        "Mr. & Mrs. Zakariah bin Abdul Aziz\n\nrequest the pleasure of your company at the wedding of their beloved son\n\nMuhamad Zahirudin\n&\nFitria Nisaq",
      weddingDate: new Date("2026-10-17T11:00:00+08:00"),
      isPublished: true,
      themeId: sampleTheme.id,
      coverImageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      showGift: false,
      showGiftQr: false,
      contactName1: "Zakariah (Father)",
      contactPhone1: "019-7304880",
      contactName2: "Zahir",
      contactPhone2: "014-2773745",
      showContact: true,
      events: {
        create: [
          {
            title: "Wedding Reception",
            description: "Lunch reception from 11:00 AM to 4:00 PM.",
            eventDate: new Date("2026-10-17T11:00:00+08:00"),
            startTime: "11:00 AM",
            endTime: "4:00 PM",
            venueName: SAMPLE_VENUE,
            address: SAMPLE_ADDRESS,
            mapUrl: SAMPLE_MAP_URL,
            wazeUrl: SAMPLE_WAZE_URL,
            order: 0,
          },
        ],
      },
      gallery: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", caption: "The proposal", order: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80", caption: "Golden hour", order: 1 },
          { imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", caption: "Our engagement", order: 2 },
          { imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80", caption: "Hand in hand", order: 3 },
          { imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", caption: "The celebration", order: 4 },
          { imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80", caption: "First dance", order: 5 },
        ],
      },
      // No RSVPs, wishes, or analytics are seeded — the account starts with only
      // the invitation content itself. Those fill in from real guests.
    },
  });

  return project.id;
}

async function main() {
  await seedThemes();
  const owner = await seedUsers();

  // The sample project is created under the owner if new, or moved to the owner
  // if it already exists — so zahirsnyder@gmail.com always owns the example.
  const projectId = await ensureSampleProject(owner.id);
  const sampleTheme = await prisma.theme.findUniqueOrThrow({
    where: { slug: SAMPLE_THEME_SLUG },
  });
  const sample = await prisma.weddingProject.update({
    where: { id: projectId },
    data: {
      userId: owner.id,
      isPublished: true,
      themeId: sampleTheme.id,
      // It's a published invitation: identity is locked and it has an expiry.
      lockedAt: new Date(),
      expiresAt: defaultExpiry(new Date("2026-10-17T11:00:00+08:00")),
    },
  });

  // Back the sample with exactly one consumed credit for its template, so it
  // behaves like a real paid invitation (no watermark, one wedding). Repoint
  // whatever purchase is already bound to it rather than creating a duplicate
  // (TemplatePurchase.projectId is unique).
  const bound = await prisma.templatePurchase.findFirst({ where: { projectId: sample.id } });
  if (bound) {
    await prisma.templatePurchase.update({
      where: { id: bound.id },
      data: {
        themeId: sampleTheme.id,
        status: "PAID",
        amountCents: sampleTheme.priceCents,
        currency: sampleTheme.currency,
      },
    });
  } else {
    const unused = await prisma.templatePurchase.findFirst({
      where: { userId: owner.id, themeId: sampleTheme.id, projectId: null },
    });
    if (unused) {
      await prisma.templatePurchase.update({
        where: { id: unused.id },
        data: { status: "PAID", projectId: sample.id },
      });
    } else {
      await prisma.templatePurchase.create({
        data: {
          userId: owner.id,
          themeId: sampleTheme.id,
          status: "PAID",
          amountCents: sampleTheme.priceCents,
          currency: sampleTheme.currency,
          projectId: sample.id,
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("  Owner login:  zahirsnyder@gmail.com / zahirf12  (ADMIN)");
  console.log("  Sample invite: /invite/zahir-nisa");
  console.log("  Marketplace:   /templates");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
