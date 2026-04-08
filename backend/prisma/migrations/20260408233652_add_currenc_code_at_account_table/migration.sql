/*
  Warnings:

  - Added the required column `currency_code` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "currency_code" "currencyType" NOT NULL;
