/**
 * AgriPulse Marketplace — Database Seed
 * Seeds categories and sample data for development.
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CATEGORIES = [
  { name: "Vegetables", slug: "vegetables", icon: "🥬", sort: 1 },
  { name: "Fruits", slug: "fruits", icon: "🍎", sort: 2 },
  { name: "Rice & Grains", slug: "rice-grains", icon: "🌾", sort: 3 },
  { name: "Root Crops", slug: "root-crops", icon: "🥕", sort: 4 },
  { name: "Poultry & Meat", slug: "poultry-meat", icon: "🐔", sort: 5 },
  { name: "Seafood", slug: "seafood", icon: "🐟", sort: 6 },
  { name: "Herbs & Spices", slug: "herbs-spices", icon: "🌿", sort: 7 },
  { name: "Dairy & Eggs", slug: "dairy-eggs", icon: "🥚", sort: 8 },
];

const SUBCATEGORIES: Record<string, { name: string; slug: string }[]> = {
  vegetables: [
    { name: "Leafy Greens", slug: "leafy-greens" },
    { name: "Fruiting Vegetables", slug: "fruiting-vegetables" },
  ],
  fruits: [
    { name: "Tropical Fruits", slug: "tropical-fruits" },
    { name: "Citrus", slug: "citrus" },
  ],
};

async function main() {
  console.log("🌱 Seeding categories...");

  for (const cat of CATEGORIES) {
    const parent = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sort,
        isActive: true,
      },
    });

    const subs = SUBCATEGORIES[cat.slug];
    if (subs) {
      for (const [i, sub] of subs.entries()) {
        await db.category.upsert({
          where: { slug: sub.slug },
          update: {},
          create: {
            name: sub.name,
            slug: sub.slug,
            parentId: parent.id,
            sortOrder: i + 1,
            isActive: true,
          },
        });
      }
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
