import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const themes = [
  {
    name: "Dark Cinematic Gold",
    slug: "dark-cinematic-gold",
    description: "Dark romantic background, gold accents, cream typography, cinematic reveals.",
    isPremium: true,
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
    isPremium: true,
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
    isPremium: false,
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
    isPremium: true,
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

async function main() {
  console.log("Seeding themes…");
  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
  }

  console.log("Seeding demo user…");
  const demoUser = await prisma.user.upsert({
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

  console.log("Seeding sample wedding project…");
  const darkGold = await prisma.theme.findUniqueOrThrow({ where: { slug: "dark-cinematic-gold" } });

  const existing = await prisma.weddingProject.findUnique({ where: { slug: "amir-aisyah" } });
  if (existing) {
    console.log("Sample project already exists, skipping.");
    return;
  }

  const project = await prisma.weddingProject.create({
    data: {
      userId: demoUser.id,
      slug: "amir-aisyah",
      groomName: "Amir",
      brideName: "Aisyah",
      title: "The Wedding of Amir & Aisyah",
      quote: "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy.",
      story:
        "We met on a rainy afternoon in a small bookshop in Kuala Lumpur, both reaching for the same worn copy of poetry. Three years of shared coffees, long drives, and quiet conversations later, Amir proposed under the stars in Cameron Highlands. Now we begin our forever — and we would be honoured to have you with us.",
      weddingDate: new Date("2026-12-12T11:00:00+08:00"),
      isPublished: true,
      themeId: darkGold.id,
      coverImageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      giftDetails: "Maybank 1234 5678 9012 (Amir Hakim) — or scan the DuitNow QR at the venue.",
      events: {
        create: [
          {
            title: "Akad Nikah",
            description: "The solemnization ceremony, followed by du'a and light refreshments.",
            eventDate: new Date("2026-12-12T11:00:00+08:00"),
            startTime: "11:00 AM",
            endTime: "12:30 PM",
            venueName: "Masjid Wilayah Persekutuan",
            address: "Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur",
            mapUrl: "https://maps.google.com/?q=Masjid+Wilayah+Persekutuan",
            order: 0,
          },
          {
            title: "Wedding Reception",
            description: "Join us for lunch, speeches, and the couple's grand entrance.",
            eventDate: new Date("2026-12-12T13:00:00+08:00"),
            startTime: "1:00 PM",
            endTime: "5:00 PM",
            venueName: "The Glasshouse at Seputeh",
            address: "Jalan Seputeh, 58000 Kuala Lumpur",
            mapUrl: "https://maps.google.com/?q=The+Glasshouse+at+Seputeh",
            order: 1,
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
      wishes: {
        create: [
          { name: "Siti & Farid", message: "Congratulations Amir & Aisyah! May Allah bless your union with endless love and happiness. Can't wait to celebrate with you both!" },
          { name: "Daniel Wong", message: "So happy for you two! Wishing you a lifetime of joy, laughter, and adventure together." },
          { name: "Nurul Huda", message: "Barakallahu lakuma! From bookshop strangers to soulmates — your story always makes me smile." },
        ],
      },
      rsvps: {
        create: [
          { name: "Siti Aminah", phone: "+60123456789", attendance: "ATTENDING", paxCount: 2, mealPreference: "No preference" },
          { name: "Daniel Wong", phone: "+60198765432", attendance: "ATTENDING", paxCount: 4, mealPreference: "Vegetarian" },
          { name: "Faizal Rahman", attendance: "NOT_ATTENDING", paxCount: 1, message: "So sorry to miss it — sending all my love!" },
          { name: "Melissa Tan", attendance: "MAYBE", paxCount: 2 },
        ],
      },
    },
  });

  // A little analytics history so dashboard charts have something to show.
  const now = Date.now();
  const analyticsRows = Array.from({ length: 60 }).map((_, i) => ({
    projectId: project.id,
    eventType: i % 9 === 0 ? "QR_SCAN" : "VISIT",
    device: i % 3 === 0 ? "desktop" : "mobile",
    referrer: i % 5 === 0 ? "whatsapp" : "direct",
    createdAt: new Date(now - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
  }));
  await prisma.analyticsEvent.createMany({ data: analyticsRows });

  console.log(`Seed complete. Sample invitation: /invite/${project.slug}`);
  console.log("Demo login: demo@inviteyou.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
