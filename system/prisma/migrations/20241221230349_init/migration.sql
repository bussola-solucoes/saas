-- CreateEnum
CREATE TYPE "StatusSendWAPP" AS ENUM ('waiting', 'success', 'error');

-- AlterTable
ALTER TABLE "MessageOrderStatusSend" ADD COLUMN     "messageStatusSendWAPP" TEXT,
ADD COLUMN     "statusSendWAPP" "StatusSendWAPP";
