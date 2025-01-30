-- AlterTable
ALTER TABLE "MessageOrderStatusSend" ADD COLUMN     "shippingUrl" TEXT,
ALTER COLUMN "shippingName" DROP NOT NULL,
ALTER COLUMN "shippingValue" DROP NOT NULL,
ALTER COLUMN "shippingTime" DROP NOT NULL,
ALTER COLUMN "shippingCode" DROP NOT NULL;
