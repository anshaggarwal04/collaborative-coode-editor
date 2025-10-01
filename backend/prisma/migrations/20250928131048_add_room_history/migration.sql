-- CreateTable
CREATE TABLE "public"."RoomHistory" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomHistory_roomId_idx" ON "public"."RoomHistory"("roomId");

-- AddForeignKey
ALTER TABLE "public"."RoomHistory" ADD CONSTRAINT "RoomHistory_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomHistory" ADD CONSTRAINT "RoomHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
