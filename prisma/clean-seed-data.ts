/**
 * Removes seeded sample products and farmers from the database.
 * Run: npx tsx prisma/clean-seed-data.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// IDs of the sample products that were seeded
const SAMPLE_PRODUCT_IDS = [
  "01a1b1c1-d1e1-4f1a-8b1c-0d1e1f1a1b1c",
  "02a2b2c2-d2e2-4f2a-8b2c-0d2e2f2a2b2c",
  "03a3b3c3-d3e3-4f3a-8b3c-0d3e3f3a3b3c",
  "04a4b4c4-d4e4-4f4a-8b4c-0d4e4f4a4b4c",
  "05a5b5c5-d5e5-4f5a-8b5c-0d5e5f5a5b5c",
  "06a6b6c6-d6e6-4f6a-8b6c-0d6e6f6a6b6c",
  "07a7b7c7-d7e7-4f7a-8b7c-0d7e7f7a7b7c",
  "08a8b8c8-d8e8-4f8a-8b8c-0d8e8f8a8b8c",
  "09a9b9c9-d9e9-4f9a-8b9c-0d9e9f9a9b9c",
  "0a1a1b1c-d1e1-4f1b-8b1d-0d1e1f1a1b1d",
  "0b2b2c2d-e2f2-4a2b-9c2d-1e2f2a2b2c2d",
  "0c3c3d3e-f3a3-4b3c-0d3e-2f3a3b3c3d3e",
  "0d4d4e4f-a4b4-4c4d-1e4f-3a4b4c4d4e4f",
  "0e5e5f5a-b5c5-4d5e-2f5a-4b5c5d5e5f5a",
  "0f6f6a6b-c6d6-4e6f-3a6b-5c6d6e6f6a6b",
  "00707a7b-c7d7-4e7f-4a7b-6c7d7e7f7a7b",
  "00808b8c-d8e8-4f8a-5b8c-7d8e8f8a8b8c",
  "00909c9d-e9f9-4a9b-6c9d-8e9f9a9b9c9d",
];

// IDs of the sample farmer users
const SAMPLE_USER_IDS = [
  "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
];

// IDs of the sample farmer profiles
const SAMPLE_FARMER_IDS = [
  "f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
  "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d",
  "f3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e",
];

async function main() {
  console.log("🧹 Removing seeded sample data...\n");

  // 1. Delete product images for sample products
  const deletedImages = await db.productImage.deleteMany({
    where: { productId: { in: SAMPLE_PRODUCT_IDS } },
  });
  console.log(`  Deleted ${deletedImages.count} product images`);

  // 2. Delete sample products
  const deletedProducts = await db.product.deleteMany({
    where: { id: { in: SAMPLE_PRODUCT_IDS } },
  });
  console.log(`  Deleted ${deletedProducts.count} products`);

  // 3. Delete sample farmer profiles
  const deletedFarmers = await db.farmer.deleteMany({
    where: { id: { in: SAMPLE_FARMER_IDS } },
  });
  console.log(`  Deleted ${deletedFarmers.count} farmer profiles`);

  // 4. Delete sample users
  const deletedUsers = await db.user.deleteMany({
    where: { id: { in: SAMPLE_USER_IDS } },
  });
  console.log(`  Deleted ${deletedUsers.count} users`);

  console.log("\n✅ Sample seed data removed. Only real farmer-created products will appear now.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
