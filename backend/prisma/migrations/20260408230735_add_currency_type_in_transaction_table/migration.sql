/*
  Warnings:

  - Added the required column `currency_code` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "currencyType" AS ENUM ('IDR', 'USD', 'SGD', 'EUR');

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "currency_code" "currencyType" NOT NULL;
