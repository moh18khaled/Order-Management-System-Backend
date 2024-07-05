/*
  Warnings:

  - You are about to drop the column `OrderId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "OrderId",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "cartAndProduct" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartAndProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cartAndProduct_cartId_productId_key" ON "cartAndProduct"("cartId", "productId");

-- AddForeignKey
ALTER TABLE "cartAndProduct" ADD CONSTRAINT "cartAndProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartAndProduct" ADD CONSTRAINT "cartAndProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
