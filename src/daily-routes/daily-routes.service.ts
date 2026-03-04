import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyRoutesService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeToIstanbulDay(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return new Date(`${y}-${m}-${d}T00:00:00.000+03:00`);
  }

  async listDriverTemplates(driverProfileId: string) {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { id: driverProfileId },
      select: { institutionId: true },
    });
    if (!driver) throw new NotFoundException('Driver profile not found');

    return this.prisma.routeTemplate.findMany({
      where: { institutionId: driver.institutionId, isActive: true },
      orderBy: [{ createdAt: 'desc' }],
      include: { _count: { select: { stops: true } } },
    });
  }

  async selectOrCreateDailyRoute(params: {
    routeTemplateId: string;
    driverProfileId: string;
    date?: Date;
  }) {
    const day = this.normalizeToIstanbulDay(params.date ?? new Date());

    const driver = await this.prisma.driverProfile.findUnique({
      where: { id: params.driverProfileId },
      select: { institutionId: true },
    });
    if (!driver) throw new NotFoundException('Driver profile not found');

    const template = await this.prisma.routeTemplate.findFirst({
      where: { id: params.routeTemplateId, isActive: true },
      include: { stops: { orderBy: { order: 'asc' } } },
    });
    if (!template) throw new NotFoundException('Route template not found');

    if (template.institutionId !== driver.institutionId) {
      throw new ForbiddenException('Driver cannot access this route template');
    }

    const existing = await this.prisma.dailyRoute.findFirst({
      where: { routeTemplateId: template.id, driverId: params.driverProfileId, date: day },
      include: { stops: { orderBy: { order: 'asc' } } },
    });
    if (existing) return existing;

    if (template.stops.length === 0) throw new ConflictException('Route template has no stops');

    return this.prisma.$transaction(async (tx) => {
      const daily = await tx.dailyRoute.create({
        data: { date: day, routeTemplateId: template.id, driverId: params.driverProfileId, status: 'PLANNED' },
      });

      await tx.dailyRouteStop.createMany({
        data: template.stops.map((s) => ({
          dailyRouteId: daily.id,
          studentId: s.studentId,
          order: s.order,
          type: 'NORMAL',
          status: 'PENDING',
          lat: s.lat,
          lng: s.lng,
        })),
      });

      return tx.dailyRoute.findUnique({
        where: { id: daily.id },
        include: { stops: { orderBy: { order: 'asc' } } },
      });
    });
  }

  async startDailyRoute(dailyRouteId: string, driverProfileId: string) {
    const route = await this.prisma.dailyRoute.findUnique({ where: { id: dailyRouteId } });
    if (!route) throw new NotFoundException('Daily route not found');
    if (route.driverId !== driverProfileId) throw new ForbiddenException('Not your daily route');
    if (route.status !== 'PLANNED') throw new ConflictException('Daily route is not in PLANNED state');

    return this.prisma.dailyRoute.update({
      where: { id: dailyRouteId },
      data: { status: 'STARTED', startedAt: new Date() },
    });
  }

  async finishDailyRoute(dailyRouteId: string, driverProfileId: string) {
    const route = await this.prisma.dailyRoute.findUnique({ where: { id: dailyRouteId } });
    if (!route) throw new NotFoundException('Daily route not found');
    if (route.driverId !== driverProfileId) throw new ForbiddenException('Not your daily route');
    if (route.status !== 'STARTED') throw new ConflictException('Daily route is not in STARTED state');

    return this.prisma.dailyRoute.update({
      where: { id: dailyRouteId },
      data: { status: 'FINISHED', finishedAt: new Date() },
    });
  }

  async getStops(dailyRouteId: string, driverProfileId: string) {
    const route = await this.prisma.dailyRoute.findUnique({ where: { id: dailyRouteId } });
    if (!route) throw new NotFoundException('Daily route not found');
    if (route.driverId !== driverProfileId) throw new ForbiddenException('Not your daily route');

    return this.prisma.dailyRouteStop.findMany({
      where: { dailyRouteId },
      orderBy: { order: 'asc' },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });
  }
}
