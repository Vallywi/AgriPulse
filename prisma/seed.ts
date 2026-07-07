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

// ═══════════════════════════════════════
// SAMPLE FARMERS
// ═══════════════════════════════════════

const SAMPLE_FARMERS = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    email: "farmer.maria@example.com",
    firstName: "Maria",
    lastName: "Santos",
    farm: {
      id: "f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
      farmName: "Santos Organic Farm",
      province: "Benguet",
      municipality: "La Trinidad",
      barangay: "Balili",
      farmSizeHectares: 2.5,
      primaryCrops: ["lettuce", "cabbage", "carrots", "strawberries"],
      farmingExperienceYears: 12,
    },
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    email: "farmer.juan@example.com",
    firstName: "Juan",
    lastName: "Dela Cruz",
    farm: {
      id: "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d",
      farmName: "Dela Cruz Rice Paddies",
      province: "Nueva Ecija",
      municipality: "Cabanatuan",
      barangay: "San Isidro",
      farmSizeHectares: 5.0,
      primaryCrops: ["rice", "corn", "mung beans"],
      farmingExperienceYears: 20,
    },
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    email: "farmer.rosa@example.com",
    firstName: "Rosa",
    lastName: "Reyes",
    farm: {
      id: "f3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e",
      farmName: "Reyes Fruit & Vegetable Farm",
      province: "Laguna",
      municipality: "Los Baños",
      barangay: "Batong Malake",
      farmSizeHectares: 3.2,
      primaryCrops: ["calamansi", "papaya", "eggplant", "tomatoes"],
      farmingExperienceYears: 8,
    },
  },
];

async function seedFarmers(tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) {
  console.log("🧑‍🌾 Seeding sample farmers...");

  for (const farmer of SAMPLE_FARMERS) {
    // Upsert user keyed on email
    await tx.user.upsert({
      where: { email: farmer.email },
      update: {
        firstName: farmer.firstName,
        lastName: farmer.lastName,
        role: "farmer",
        isActive: true,
      },
      create: {
        id: farmer.id,
        email: farmer.email,
        firstName: farmer.firstName,
        lastName: farmer.lastName,
        role: "farmer",
        isActive: true,
        isVerified: true,
      },
    });

    // Upsert farmer profile keyed on userId
    await tx.farmer.upsert({
      where: { userId: farmer.id },
      update: {
        farmName: farmer.farm.farmName,
        province: farmer.farm.province,
        municipality: farmer.farm.municipality,
        barangay: farmer.farm.barangay,
        farmSizeHectares: farmer.farm.farmSizeHectares,
        primaryCrops: farmer.farm.primaryCrops,
        farmingExperienceYears: farmer.farm.farmingExperienceYears,
      },
      create: {
        id: farmer.farm.id,
        userId: farmer.id,
        farmName: farmer.farm.farmName,
        province: farmer.farm.province,
        municipality: farmer.farm.municipality,
        barangay: farmer.farm.barangay,
        farmSizeHectares: farmer.farm.farmSizeHectares,
        primaryCrops: farmer.farm.primaryCrops,
        farmingExperienceYears: farmer.farm.farmingExperienceYears,
      },
    });
  }

  console.log("✅ Farmers seeded.");
}

// ═══════════════════════════════════════
// SAMPLE PRODUCTS
// ═══════════════════════════════════════

const SAMPLE_PRODUCTS = [
  // Vegetables (farmer: Maria Santos)
  {
    id: "01a1b1c1-d1e1-4f1a-8b1c-0d1e1f1a1b1c",
    name: "Pechay",
    description: "Fresh pechay harvested daily from organic highland farms in Benguet. Crisp leaves perfect for sinigang and stir-fry dishes.",
    price: 45.0,
    unit: "kg" as const,
    availableQuantity: 200,
    minimumOrder: 1,
    categorySlug: "vegetables",
    farmerIdx: 0,
  },
  {
    id: "02a2b2c2-d2e2-4f2a-8b2c-0d2e2f2a2b2c",
    name: "Kangkong",
    description: "Organically grown kangkong with tender stems and vibrant green leaves. Ideal for adobong kangkong and sinigang.",
    price: 35.0,
    unit: "bundle" as const,
    availableQuantity: 150,
    minimumOrder: 2,
    categorySlug: "vegetables",
    farmerIdx: 0,
  },
  {
    id: "03a3b3c3-d3e3-4f3a-8b3c-0d3e3f3a3b3c",
    name: "Sitaw",
    description: "Long string beans freshly picked from La Trinidad farms. Great for pinakbet, ginisang sitaw, and kare-kare.",
    price: 60.0,
    unit: "kg" as const,
    availableQuantity: 120,
    minimumOrder: 1,
    categorySlug: "vegetables",
    farmerIdx: 0,
  },
  // Fruits (farmer: Rosa Reyes)
  {
    id: "04a4b4c4-d4e4-4f4a-8b4c-0d4e4f4a4b4c",
    name: "Saging na Saba",
    description: "Premium cooking bananas grown in Laguna. Perfect for turon, banana cue, and maruya. Sweet and firm when cooked.",
    price: 80.0,
    unit: "kg" as const,
    availableQuantity: 500,
    minimumOrder: 2,
    categorySlug: "fruits",
    farmerIdx: 2,
  },
  {
    id: "05a5b5c5-d5e5-4f5a-8b5c-0d5e5f5a5b5c",
    name: "Mangga (Carabao Mango)",
    description: "World-renowned Philippine Carabao mangoes. Naturally sweet with golden flesh, sourced directly from Laguna orchards.",
    price: 150.0,
    unit: "kg" as const,
    availableQuantity: 300,
    minimumOrder: 1,
    categorySlug: "fruits",
    farmerIdx: 2,
  },
  {
    id: "06a6b6c6-d6e6-4f6a-8b6c-0d6e6f6a6b6c",
    name: "Papaya",
    description: "Ripe solo papaya from Reyes Farm in Los Baños. Rich in vitamins, perfect for atsara, desserts, or eating fresh.",
    price: 55.0,
    unit: "piece" as const,
    availableQuantity: 80,
    minimumOrder: 1,
    categorySlug: "fruits",
    farmerIdx: 2,
  },
  // Rice & Grains (farmer: Juan Dela Cruz)
  {
    id: "07a7b7c7-d7e7-4f7a-8b7c-0d7e7f7a7b7c",
    name: "Sinandomeng Rice",
    description: "Premium Sinandomeng rice from the rice paddies of Nueva Ecija. Soft, aromatic, and fluffy when cooked. A Filipino household staple.",
    price: 2200.0,
    unit: "sack" as const,
    availableQuantity: 50,
    minimumOrder: 1,
    categorySlug: "rice-grains",
    farmerIdx: 1,
  },
  {
    id: "08a8b8c8-d8e8-4f8a-8b8c-0d8e8f8a8b8c",
    name: "Dinorado Rice",
    description: "Fragrant Dinorado rice grown in Cabanatuan's fertile fields. Known for its slightly sweet taste and superior grain quality.",
    price: 2800.0,
    unit: "sack" as const,
    availableQuantity: 30,
    minimumOrder: 1,
    categorySlug: "rice-grains",
    farmerIdx: 1,
  },
  // Root Crops (farmer: Maria Santos)
  {
    id: "09a9b9c9-d9e9-4f9a-8b9c-0d9e9f9a9b9c",
    name: "Kamote (Sweet Potato)",
    description: "Purple and yellow kamote varieties from Benguet highland farms. Naturally sweet, great for boiling, frying, or baking.",
    price: 50.0,
    unit: "kg" as const,
    availableQuantity: 300,
    minimumOrder: 2,
    categorySlug: "root-crops",
    farmerIdx: 0,
  },
  {
    id: "0a1a1b1c-d1e1-4f1b-8b1d-0d1e1f1a1b1d",
    name: "Ube (Purple Yam)",
    description: "Vibrant purple ube from the Cordillera highlands. Essential ingredient for ube halaya, ice cream, and traditional Filipino desserts.",
    price: 120.0,
    unit: "kg" as const,
    availableQuantity: 100,
    minimumOrder: 1,
    categorySlug: "root-crops",
    farmerIdx: 0,
  },
  // Poultry & Meat (farmer: Juan Dela Cruz)
  {
    id: "0b2b2c2d-e2f2-4a2b-9c2d-1e2f2a2b2c2d",
    name: "Free-range Chicken",
    description: "Native free-range chicken raised in open farms of Nueva Ecija. Lean and flavorful, perfect for tinola and adobo.",
    price: 280.0,
    unit: "kg" as const,
    availableQuantity: 60,
    minimumOrder: 1,
    categorySlug: "poultry-meat",
    farmerIdx: 1,
  },
  {
    id: "0c3c3d3e-f3a3-4b3c-0d3e-2f3a3b3c3d3e",
    name: "Native Pork",
    description: "Locally raised native pork from small-scale farms. Rich marbling and deep flavor, ideal for lechon kawali and sisig.",
    price: 350.0,
    unit: "kg" as const,
    availableQuantity: 40,
    minimumOrder: 1,
    categorySlug: "poultry-meat",
    farmerIdx: 1,
  },
  // Seafood (farmer: Rosa Reyes)
  {
    id: "0d4d4e4f-a4b4-4c4d-1e4f-3a4b4c4d4e4f",
    name: "Bangus (Milkfish)",
    description: "Fresh bangus from Laguna de Bay fish pens. Deboned and cleaned, ready for daing, sinigang, or paksiw na bangus.",
    price: 220.0,
    unit: "kg" as const,
    availableQuantity: 80,
    minimumOrder: 1,
    categorySlug: "seafood",
    farmerIdx: 2,
  },
  {
    id: "0e5e5f5a-b5c5-4d5e-2f5a-4b5c5d5e5f5a",
    name: "Tilapia",
    description: "Freshwater tilapia sustainably farmed in Los Baños. Perfect for grilling, frying, or sinigang sa miso.",
    price: 160.0,
    unit: "kg" as const,
    availableQuantity: 100,
    minimumOrder: 1,
    categorySlug: "seafood",
    farmerIdx: 2,
  },
  // Herbs & Spices (farmer: Maria Santos)
  {
    id: "0f6f6a6b-c6d6-4e6f-3a6b-5c6d6e6f6a6b",
    name: "Dahon ng Sili (Chili Leaves)",
    description: "Fresh chili leaves from organic Benguet gardens. Nutritious and mildly peppery, commonly used in tinola and salads.",
    price: 30.0,
    unit: "bundle" as const,
    availableQuantity: 200,
    minimumOrder: 3,
    categorySlug: "herbs-spices",
    farmerIdx: 0,
  },
  {
    id: "00707a7b-c7d7-4e7f-4a7b-6c7d7e7f7a7b",
    name: "Luya (Ginger)",
    description: "Aromatic fresh ginger root harvested from highland farms. Essential for salabat, tinola, and various Filipino dishes.",
    price: 90.0,
    unit: "kg" as const,
    availableQuantity: 150,
    minimumOrder: 1,
    categorySlug: "herbs-spices",
    farmerIdx: 0,
  },
  // Dairy & Eggs (farmer: Juan Dela Cruz)
  {
    id: "00808b8c-d8e8-4f8a-5b8c-7d8e8f8a8b8c",
    name: "Fresh Duck Eggs",
    description: "Farm-fresh duck eggs from free-range ducks in Nueva Ecija. Rich yolks ideal for making salted eggs or balut.",
    price: 12.0,
    unit: "piece" as const,
    availableQuantity: 500,
    minimumOrder: 6,
    categorySlug: "dairy-eggs",
    farmerIdx: 1,
  },
  {
    id: "00909c9d-e9f9-4a9b-6c9d-8e9f9a9b9c9d",
    name: "Carabao Milk",
    description: "Pure fresh carabao milk from Nueva Ecija dairy farms. Creamier than cow milk, perfect for pastillas and kesong puti.",
    price: 95.0,
    unit: "piece" as const,
    availableQuantity: 50,
    minimumOrder: 1,
    categorySlug: "dairy-eggs",
    farmerIdx: 1,
  },
];

// ═══════════════════════════════════════
// PRODUCT IMAGE IDs (deterministic for idempotent upserts)
// ═══════════════════════════════════════

const PRODUCT_IMAGE_IDS: Record<string, string> = {
  "01a1b1c1-d1e1-4f1a-8b1c-0d1e1f1a1b1c": "11a1b1c1-d1e1-4f1a-8b1c-0d1e1f1a1b1c",
  "02a2b2c2-d2e2-4f2a-8b2c-0d2e2f2a2b2c": "12a2b2c2-d2e2-4f2a-8b2c-0d2e2f2a2b2c",
  "03a3b3c3-d3e3-4f3a-8b3c-0d3e3f3a3b3c": "13a3b3c3-d3e3-4f3a-8b3c-0d3e3f3a3b3c",
  "04a4b4c4-d4e4-4f4a-8b4c-0d4e4f4a4b4c": "14a4b4c4-d4e4-4f4a-8b4c-0d4e4f4a4b4c",
  "05a5b5c5-d5e5-4f5a-8b5c-0d5e5f5a5b5c": "15a5b5c5-d5e5-4f5a-8b5c-0d5e5f5a5b5c",
  "06a6b6c6-d6e6-4f6a-8b6c-0d6e6f6a6b6c": "16a6b6c6-d6e6-4f6a-8b6c-0d6e6f6a6b6c",
  "07a7b7c7-d7e7-4f7a-8b7c-0d7e7f7a7b7c": "17a7b7c7-d7e7-4f7a-8b7c-0d7e7f7a7b7c",
  "08a8b8c8-d8e8-4f8a-8b8c-0d8e8f8a8b8c": "18a8b8c8-d8e8-4f8a-8b8c-0d8e8f8a8b8c",
  "09a9b9c9-d9e9-4f9a-8b9c-0d9e9f9a9b9c": "19a9b9c9-d9e9-4f9a-8b9c-0d9e9f9a9b9c",
  "0a1a1b1c-d1e1-4f1b-8b1d-0d1e1f1a1b1d": "1a1a1b1c-d1e1-4f1b-8b1d-0d1e1f1a1b1d",
  "0b2b2c2d-e2f2-4a2b-9c2d-1e2f2a2b2c2d": "1b2b2c2d-e2f2-4a2b-9c2d-1e2f2a2b2c2d",
  "0c3c3d3e-f3a3-4b3c-0d3e-2f3a3b3c3d3e": "1c3c3d3e-f3a3-4b3c-0d3e-2f3a3b3c3d3e",
  "0d4d4e4f-a4b4-4c4d-1e4f-3a4b4c4d4e4f": "1d4d4e4f-a4b4-4c4d-1e4f-3a4b4c4d4e4f",
  "0e5e5f5a-b5c5-4d5e-2f5a-4b5c5d5e5f5a": "1e5e5f5a-b5c5-4d5e-2f5a-4b5c5d5e5f5a",
  "0f6f6a6b-c6d6-4e6f-3a6b-5c6d6e6f6a6b": "1f6f6a6b-c6d6-4e6f-3a6b-5c6d6e6f6a6b",
  "00707a7b-c7d7-4e7f-4a7b-6c7d7e7f7a7b": "10707a7b-c7d7-4e7f-4a7b-6c7d7e7f7a7b",
  "00808b8c-d8e8-4f8a-5b8c-7d8e8f8a8b8c": "10808b8c-d8e8-4f8a-5b8c-7d8e8f8a8b8c",
  "00909c9d-e9f9-4a9b-6c9d-8e9f9a9b9c9d": "10909c9d-e9f9-4a9b-6c9d-8e9f9a9b9c9d",
};

async function seedProductImages(tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) {
  console.log("🖼️ Seeding product images...");

  for (const product of SAMPLE_PRODUCTS) {
    const imageId = PRODUCT_IMAGE_IDS[product.id];
    if (!imageId) {
      throw new Error(
        `No image ID mapping for product "${product.name}" (${product.id}). Update PRODUCT_IMAGE_IDS.`
      );
    }

    // Create a slug from product name for deterministic picsum URLs
    const productSlug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const imageUrl = `https://picsum.photos/seed/${productSlug}/400/400`;
    const thumbnailUrl = `https://picsum.photos/seed/${productSlug}/200/200`;

    await tx.productImage.upsert({
      where: { id: imageId },
      update: {
        productId: product.id,
        imageUrl,
        thumbnailUrl,
        isPrimary: true,
        sortOrder: 0,
      },
      create: {
        id: imageId,
        productId: product.id,
        imageUrl,
        thumbnailUrl,
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  console.log(`✅ ${SAMPLE_PRODUCTS.length} product images seeded.`);
}

async function seedProducts(tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) {
  console.log("🛒 Seeding sample products...");

  // Look up category IDs by slug
  const categories = await tx.category.findMany({
    where: { slug: { in: CATEGORIES.map((c) => c.slug) } },
    select: { id: true, slug: true },
  });
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Map farmer indices to their farmer profile IDs
  const farmerIds = SAMPLE_FARMERS.map((f) => f.farm.id);

  for (const product of SAMPLE_PRODUCTS) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(
        `Category not found for slug "${product.categorySlug}" while seeding product "${product.name}". Ensure categories are seeded first.`
      );
    }

    const farmerId = farmerIds[product.farmerIdx];

    await tx.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        availableQuantity: product.availableQuantity,
        minimumOrder: product.minimumOrder,
        categoryId,
        farmerId,
        isActive: true,
        deletedAt: null,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        availableQuantity: product.availableQuantity,
        minimumOrder: product.minimumOrder,
        categoryId,
        farmerId,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  console.log(`✅ ${SAMPLE_PRODUCTS.length} products seeded.`);
}

async function main() {
  // ─── Category seeding (independent, outside transaction) ───
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

  console.log("✅ Categories seeded.");

  // ─── Farmer + Product + Image seeding (transactional) ───
  // Wrapped in an interactive transaction to prevent partial data on failure.
  // If any step fails, the entire transaction rolls back — no partial seed state.
  await db.$transaction(async (tx) => {
    try {
      await seedFarmers(tx);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed during farmer seeding step: ${message}`);
      throw error;
    }

    try {
      await seedProducts(tx);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed during product seeding step: ${message}`);
      throw error;
    }

    try {
      await seedProductImages(tx);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed during product image seeding step: ${message}`);
      throw error;
    }
  });

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
