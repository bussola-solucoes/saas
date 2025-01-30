-- CreateTable
CREATE TABLE "MessageOrderStatusSend" (
    "id" TEXT NOT NULL,
    "code" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "statusName" TEXT NOT NULL,
    "statusDate" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "shippingName" TEXT NOT NULL,
    "shippingValue" TEXT NOT NULL,
    "shippingTime" TEXT NOT NULL,
    "shippingCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "MessageOrderStatusSend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageOrderStatusSend" ADD CONSTRAINT "MessageOrderStatusSend_statusCode_fkey" FOREIGN KEY ("statusCode") REFERENCES "OrderStatus"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
