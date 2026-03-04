-- CreateTable
CREATE TABLE "LocationLog" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "dailyRouteId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LocationLog_driverId_idx" ON "LocationLog"("driverId");

-- CreateIndex
CREATE INDEX "LocationLog_dailyRouteId_idx" ON "LocationLog"("dailyRouteId");

-- CreateIndex
CREATE INDEX "LocationLog_createdAt_idx" ON "LocationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "LocationLog" ADD CONSTRAINT "LocationLog_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLog" ADD CONSTRAINT "LocationLog_dailyRouteId_fkey" FOREIGN KEY ("dailyRouteId") REFERENCES "DailyRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
