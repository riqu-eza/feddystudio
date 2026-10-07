import "dotenv/config";
import { prisma } from "../lib/prisma";
async function main() {
  /* ---------- SERVICES ---------- */
  const services = [
    { icon: "📸", title: "Portrait Photography", description: "Studio and outdoor portraits for individuals, families, birthdays and personal branding.", sortOrder: 1 },
    { icon: "🎓", title: "Graduation",            description: "Classic graduation portraits and creative graduate sessions designed around your style.", sortOrder: 2 },
    { icon: "💍", title: "Wedding Photography",   description: "Capture your wedding day with beautiful photographs and cinematic video coverage.", sortOrder: 3 },
    { icon: "🎂", title: "Birthday Photoshoot",   description: "Celebrate your special day with creative birthday portraits, themed setups and beautiful memories.", sortOrder: 4 },
    { icon: "🤰", title: "Baby Bump",             description: "Elegant maternity sessions in the studio or outdoors, with creative styling options.", sortOrder: 5 },
    { icon: "🎥", title: "Event Videography",     description: "Professional video coverage for celebrations, corporate events and special occasions.", sortOrder: 6 },
    { icon: "🏢", title: "Commercial Content",    description: "Promotional photography and video content for businesses, products and social media.", sortOrder: 7 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { title: s.title },
      update: s,
      create: s,
    });
  }

  /* ---------- RATES / PACKAGES ---------- */
  const rates = [
    {
      icon: "🎓",
      title: "Graduation Photography",
      price: "From KSh 200",
      items: [
        "Normal graduation — KSh 200/photo",
        "Creative graduate shoot — KSh 250/photo",
        "5-photo package — KSh 1,500",
        "10-photo package — KSh 3,000",
      ],
      ctaLabel: "Book Graduation",
      ctaMessage: "Hello FEDDY STUDIO, I want to book a graduation photoshoot.",
      sortOrder: 1,
    },
    {
      icon: "🤰",
      title: "Outdoor Baby Bump",
      price: "KSh 3,500",
      items: [
        "1 hour 30 minute session",
        "7 professionally edited photos",
        "Outdoor location shoot",
      ],
      ctaLabel: "Book Baby Bump",
      ctaMessage: "Hello FEDDY STUDIO, I want to book an outdoor baby bump photoshoot.",
      sortOrder: 2,
    },
    {
      icon: "📸",
      title: "Indoor Baby Bump",
      price: "From KSh 250",
      items: [
        "Own outfit — KSh 250/photo",
        "Studio outfit — KSh 500/photo",
        "More than one photo — KSh 300/photo",
        "Creative studio setup available",
      ],
      ctaLabel: "Book Studio Shoot",
      ctaMessage: "Hello FEDDY STUDIO, I want to book an indoor baby bump photoshoot.",
      sortOrder: 3,
    },
    {
      icon: "🎂",
      title: "Birthday Photoshoot",
      price: "Contact Us",
      items: [
        "Creative birthday portraits",
        "Themed studio setups",
        "Professional lighting",
        "Edited digital photos",
      ],
      ctaLabel: "Get Birthday Rates",
      ctaMessage: "Hello FEDDY STUDIO, I want birthday photoshoot rates.",
      sortOrder: 4,
    },
    {
      icon: "💍",
      title: "Wedding Photography",
      price: "Contact Us",
      items: [
        "Wedding photography",
        "Wedding videography",
        "Event coverage",
        "Custom packages available",
      ],
      ctaLabel: "Get Wedding Rates",
      ctaMessage: "Hello FEDDY STUDIO, I want wedding rates.",
      sortOrder: 5,
    },
    {
      icon: "🎥",
      title: "Events & Videography",
      price: "Contact Us",
      items: [
        "Event photography",
        "Professional video coverage",
        "Social media content",
        "Commercial video production",
      ],
      ctaLabel: "Get Event Rates",
      ctaMessage: "Hello FEDDY STUDIO, I want event or videography rates.",
      sortOrder: 6,
    },
  ];
  for (const r of rates) {
    await prisma.rate.upsert({
      where: { title: r.title },
      update: r,
      create: r,
    });
  }

  /* ---------- ADMIN (pre-authorize your Google email) ---------- */
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (adminEmail) {
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {},
      create: { email: adminEmail, name: "FEDDY Admin" },
    });
    console.log(`✅ Admin seeded: ${adminEmail}`);
  }

  console.log("✅ Seed complete");
}

main()
  .then(() => console.log("Seeded"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });