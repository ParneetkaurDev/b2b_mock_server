-- CreateTable
CREATE TABLE "User" (
    "subscriber_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriber_url" TEXT NOT NULL,
    "unique_key_id" TEXT NOT NULL,
    "signing_public_key" TEXT NOT NULL,
    "valid_until" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("subscriber_id")
);
