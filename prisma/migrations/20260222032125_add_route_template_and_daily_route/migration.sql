-- CreateEnum
CREATE TYPE "RouteDirection" AS ENUM ('AM', 'PM');

-- CreateEnum
CREATE TYPE "DailyRouteStatus" AS ENUM ('PLANNED', 'STARTED', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DailyStopType" AS ENUM ('NORMAL', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "DailyStopStatus" AS ENUM ('PENDING', 'SKIPPED', 'BOARDED', 'DROPPED');

-- CreateTable
CREATE TABLE "RouteTemplate" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "direction" "RouteDirection" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeTemplateId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "plannedTime" TEXT,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRoute" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "routeTemplateId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "status" "DailyRouteStatus" NOT NULL DEFAULT 'PLANNED',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRouteStop" (
    "id" TEXT NOT NULL,
    "dailyRouteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "DailyStopType" NOT NULL DEFAULT 'NORMAL',
    "status" "DailyStopStatus" NOT NULL DEFAULT 'PENDING',
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyRouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RouteTemplate_institutionId_idx" ON "RouteTemplate"("institutionId");

-- CreateIndex
CREATE INDEX "RouteTemplate_institutionId_isActive_idx" ON "RouteTemplate"("institutionId", "isActive");

-- CreateIndex
CREATE INDEX "RouteStop_routeTemplateId_idx" ON "RouteStop"("routeTemplateId");

-- CreateIndex
CREATE INDEX "RouteStop_studentId_idx" ON "RouteStop"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeTemplateId_studentId_key" ON "RouteStop"("routeTemplateId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeTemplateId_order_key" ON "RouteStop"("routeTemplateId", "order");

-- CreateIndex
CREATE INDEX "DailyRoute_date_idx" ON "DailyRoute"("date");

-- CreateIndex
CREATE INDEX "DailyRoute_driverId_date_idx" ON "DailyRoute"("driverId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRoute_routeTemplateId_driverId_date_key" ON "DailyRoute"("routeTemplateId", "driverId", "date");

-- CreateIndex
CREATE INDEX "DailyRouteStop_dailyRouteId_idx" ON "DailyRouteStop"("dailyRouteId");

-- CreateIndex
CREATE INDEX "DailyRouteStop_studentId_idx" ON "DailyRouteStop"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRouteStop_dailyRouteId_studentId_key" ON "DailyRouteStop"("dailyRouteId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRouteStop_dailyRouteId_order_key" ON "DailyRouteStop"("dailyRouteId", "order");

-- AddForeignKey
ALTER TABLE "RouteTemplate" ADD CONSTRAINT "RouteTemplate_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeTemplateId_fkey" FOREIGN KEY ("routeTemplateId") REFERENCES "RouteTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRoute" ADD CONSTRAINT "DailyRoute_routeTemplateId_fkey" FOREIGN KEY ("routeTemplateId") REFERENCES "RouteTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRoute" ADD CONSTRAINT "DailyRoute_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRouteStop" ADD CONSTRAINT "DailyRouteStop_dailyRouteId_fkey" FOREIGN KEY ("dailyRouteId") REFERENCES "DailyRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRouteStop" ADD CONSTRAINT "DailyRouteStop_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
