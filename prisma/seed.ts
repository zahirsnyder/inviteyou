import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultExpiry } from "../src/lib/constants";

const prisma = new PrismaClient();

const DEMO_PREVIEW = "/invite/zahir-nisa";

const themes = [
  {
    name: "Dark Cinematic Gold",
    slug: "dark-cinematic-gold",
    description:
      "Dark romantic background, gold accents, cream typography, cinematic scroll-storytelling reveals.",
    tagline: "Opens like a film — dark, gold, unforgettable.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: DEMO_PREVIEW,
    previewImageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    config: JSON.stringify({
      fontHeading: "Cormorant Garamond",
      fontBody: "Plus Jakarta Sans",
      fontSignature: "Great Vibes",
      primaryColor: "#c9a24b",
      secondaryColor: "#f5efe0",
      background: "dark",
      animationStyle: "cinematic",
    }),
  },
  {
    name: "Royal Malay Classic",
    slug: "royal-malay-classic",
    description: "Songket-inspired ornaments, royal gold and deep emerald palette.",
    tagline: "Songket ornaments in gold and emerald.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: DEMO_PREVIEW,
    previewImageUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
    config: JSON.stringify({
      fontHeading: "Playfair Display",
      fontBody: "Inter",
      primaryColor: "#0f5132",
      secondaryColor: "#d4af37",
      background: "emerald",
      animationStyle: "elegant",
    }),
  },
  {
    name: "Minimal Luxury White",
    slug: "minimal-luxury-white",
    description: "Airy white space, editorial serif typography, quiet luxury.",
    tagline: "Quiet luxury — airy white and editorial serif.",
    isPremium: false,
    isListed: true,
    priceCents: 0,
    currency: "MYR",
    previewUrl: DEMO_PREVIEW,
    previewImageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    config: JSON.stringify({
      fontHeading: "Libre Baskerville",
      fontBody: "Manrope",
      primaryColor: "#1a1a1a",
      secondaryColor: "#b8a88a",
      background: "light",
      animationStyle: "minimal",
    }),
  },
  {
    name: "Garden Floral",
    slug: "garden-floral",
    description: "Soft botanical illustrations, blush and sage tones.",
    tagline: "Blush and sage with soft botanical art.",
    isPremium: true,
    isListed: true,
    priceCents: 5900,
    currency: "MYR",
    previewUrl: DEMO_PREVIEW,
    previewImageUrl:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
    config: JSON.stringify({
      fontHeading: "Cormorant Garamond",
      fontBody: "Inter",
      primaryColor: "#7c9070",
      secondaryColor: "#e8c4c4",
      background: "floral",
      animationStyle: "soft",
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
  const darkGold = await prisma.theme.findUniqueOrThrow({
    where: { slug: "dark-cinematic-gold" },
  });

  const existing = await prisma.weddingProject.findUnique({ where: { slug: "zahir-nisa" } });
  if (existing) {
    await prisma.weddingProject.update({
      where: { id: existing.id },
      data: {
        coverImageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      },
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
      title: "Walimatul Urus — Muhamad Zahirudin & Fitria Nisaq",
      quote:
        "Dengan penuh rasa hormat dan berbesar hati, kami menjemput Dato’ / Datin / Tuan / Puan / Encik / Cik dan keluarga.",
      story:
        "Zakariah bin Abdul Aziz & Masrifah binti A. Rahman\n\nDengan segala hormatnya menjemput anda ke majlis perkahwinan putera kesayangan kami:\n\nMuhamad Zahirudin bin Zakariah & Fitria Nisaq binti Aidili",
      weddingDate: new Date("2026-10-17T11:00:00+08:00"),
      isPublished: true,
      themeId: darkGold.id,
      coverImageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      giftDetails: "Hubungi: 019-7304880 (Bapa) · 014-2773745 (Zahir)",
      events: {
        create: [
          {
            title: "Majlis Walimatul Urus",
            description: "Jamuan makan dari 11:00 pagi hingga 4:00 petang.",
            eventDate: new Date("2026-10-17T11:00:00+08:00"),
            startTime: "11:00 AM",
            endTime: "4:00 PM",
            venueName: "The Alnia",
            address:
              "Lot 1356, Jalan Tanjung Syawal, Kampung Sungai Pinang, 41400 Klang, Selangor",
            mapUrl:
              "https://www.google.com/maps/search/?api=1&query=The+Alnia%2C+Lot+1356%2C+Jalan+Tanjung+Syawal%2C+Kampung+Sungai+Pinang%2C+41400+Klang%2C+Selangor",
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
  const darkGold = await prisma.theme.findUniqueOrThrow({
    where: { slug: "dark-cinematic-gold" },
  });
  const sample = await prisma.weddingProject.update({
    where: { id: projectId },
    data: {
      userId: owner.id,
      isPublished: true,
      themeId: darkGold.id,
      // It's a published invitation: identity is locked and it has an expiry.
      lockedAt: new Date(),
      expiresAt: defaultExpiry(new Date("2026-10-17T11:00:00+08:00")),
    },
  });

  // Back the sample invitation with one consumed Cinematic Gold credit, so it
  // behaves exactly like a real paid invitation (no watermark, one wedding).
  const existingCredit = await prisma.templatePurchase.findFirst({
    where: { userId: owner.id, themeId: darkGold.id },
  });
  if (existingCredit) {
    await prisma.templatePurchase.update({
      where: { id: existingCredit.id },
      data: { status: "PAID", projectId: sample.id },
    });
  } else {
    await prisma.templatePurchase.create({
      data: {
        userId: owner.id,
        themeId: darkGold.id,
        status: "PAID",
        amountCents: darkGold.priceCents,
        currency: darkGold.currency,
        projectId: sample.id,
      },
    });
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
