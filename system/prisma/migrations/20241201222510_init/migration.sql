-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageOrderStatus" (
    "id" TEXT NOT NULL,
    "code" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "statusName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "MessageOrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_code_key" ON "OrderStatus"("code");

-- AddForeignKey
ALTER TABLE "MessageOrderStatus" ADD CONSTRAINT "MessageOrderStatus_statusCode_fkey" FOREIGN KEY ("statusCode") REFERENCES "OrderStatus"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
