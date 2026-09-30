/*
  Warnings:

  - You are about to drop the column `balance` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `account` table. All the data in the column will be lost.
  - The `type` column on the `account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `avatarPublicId` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiptPublicId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiptUrl` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `BigInt`.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `refreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pair_transaction_id]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color_name` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `currency_code` on the `account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `color_name` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon_name` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `category` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_at` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `currency_code` on the `transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "wallet_type" AS ENUM ('cash', 'e_wallet', 'bank', 'investment');

-- CreateEnum
CREATE TYPE "currency_type" AS ENUM ('IDR', 'USD', 'SGD', 'EUR');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('income', 'expense', 'transfer_in', 'transfer_out');

-- CreateEnum
CREATE TYPE "category_type" AS ENUM ('income', 'expense');

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_userId_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "refreshToken" DROP CONSTRAINT "refreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "role" DROP CONSTRAINT "role_userId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_categoryId_fkey";

-- DropIndex
DROP INDEX "account_name_idx";

-- DropIndex
DROP INDEX "account_type_idx";

-- DropIndex
DROP INDEX "account_updatedAt_idx";

-- DropIndex
DROP INDEX "account_userId_idx";

-- DropIndex
DROP INDEX "category_name_idx";

-- DropIndex
DROP INDEX "category_type_idx";

-- DropIndex
DROP INDEX "category_updatedAt_idx";

-- DropIndex
DROP INDEX "category_userId_idx";

-- DropIndex
DROP INDEX "profile_displayName_key";

-- DropIndex
DROP INDEX "profile_userId_key";

-- DropIndex
DROP INDEX "transaction_accountId_idx";

-- DropIndex
DROP INDEX "transaction_categoryId_idx";

-- DropIndex
DROP INDEX "transaction_deletedAt_idx";

-- DropIndex
DROP INDEX "transaction_transactionAt_idx";

-- DropIndex
DROP INDEX "transaction_type_idx";

-- DropIndex
DROP INDEX "transaction_updatedAt_idx";

-- DropIndex
DROP INDEX "user_name_idx";

-- DropIndex
DROP INDEX "user_updatedAt_idx";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "balance",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "color_name" TEXT NOT NULL,
ADD COLUMN     "created_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "initial_balance" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "wallet_type" NOT NULL DEFAULT 'cash',
DROP COLUMN "currency_code",
ADD COLUMN     "currency_code" "currency_type" NOT NULL;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "color_name" TEXT NOT NULL,
ADD COLUMN     "created_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "icon_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "category_type" NOT NULL;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "avatarPublicId",
DROP COLUMN "avatarUrl",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "displayName",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "avatar_public_id" TEXT,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "birth_date" BIGINT,
ADD COLUMN     "created_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "updated_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "accountId",
DROP COLUMN "categoryId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "receiptPublicId",
DROP COLUMN "receiptUrl",
DROP COLUMN "transactionAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "amount_in_idr" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "created_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "deleted_at" BIGINT,
ADD COLUMN     "pair_transaction_id" TEXT,
ADD COLUMN     "receipt_public_id" TEXT,
ADD COLUMN     "receipt_url" TEXT,
ADD COLUMN     "transaction_at" BIGINT NOT NULL,
ADD COLUMN     "updated_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE BIGINT,
DROP COLUMN "type",
ADD COLUMN     "type" "transaction_type" NOT NULL,
DROP COLUMN "currency_code",
ADD COLUMN     "currency_code" "currency_type" NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'user',
ADD COLUMN     "updated_at" BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "refreshToken";

-- DropTable
DROP TABLE "role";

-- DropEnum
DROP TYPE "currencyType";

-- DropEnum
DROP TYPE "transactionType";

-- DropEnum
DROP TYPE "walletType";

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expired_at" BIGINT NOT NULL,
    "device" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" BIGINT NOT NULL DEFAULT 0,
    "updated_at" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "color_name" TEXT NOT NULL,
    "start_at" BIGINT NOT NULL,
    "end_at" BIGINT NOT NULL,
    "limit_amount" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" BIGINT NOT NULL DEFAULT 0,
    "updated_at" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" BIGINT NOT NULL DEFAULT 0,
    "updated_at" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_tag" (
    "transaction_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "transaction_tag_pkey" PRIMARY KEY ("transaction_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_hash_key" ON "refresh_token"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token"("user_id");

-- CreateIndex
CREATE INDEX "budget_user_id_name_idx" ON "budget"("user_id", "name");

-- CreateIndex
CREATE INDEX "budget_user_id_start_at_end_at_idx" ON "budget"("user_id", "start_at", "end_at");

-- CreateIndex
CREATE INDEX "budget_user_id_category_id_idx" ON "budget"("user_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_user_id_name_key" ON "tag"("user_id", "name");

-- CreateIndex
CREATE INDEX "account_user_id_name_idx" ON "account"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "category_user_id_name_key" ON "category"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE INDEX "profile_user_id_idx" ON "profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_pair_transaction_id_key" ON "transaction"("pair_transaction_id");

-- CreateIndex
CREATE INDEX "transaction_user_id_amount_in_idr_idx" ON "transaction"("user_id", "amount_in_idr");

-- CreateIndex
CREATE INDEX "transaction_user_id_transaction_at_idx" ON "transaction"("user_id", "transaction_at");

-- CreateIndex
CREATE INDEX "transaction_user_id_category_id_idx" ON "transaction"("user_id", "category_id");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_pair_transaction_id_fkey" FOREIGN KEY ("pair_transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tag" ADD CONSTRAINT "transaction_tag_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tag" ADD CONSTRAINT "transaction_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
