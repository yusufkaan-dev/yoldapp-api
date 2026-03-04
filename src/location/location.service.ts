import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDriverProfileIdByUserId(userId: string) {
    const dp = await this.prisma.driverProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!dp) throw new NotFoundException('Driver profile not found');
    return dp.id;
  }

  async ingestDriverLocation(userId: string, dto: CreateLocationDto) {
    const driverProfileId = await this.getDriverProfileIdByUserId(userId);

    return this.prisma.locationLog.create({
      data: {
        driverId: driverProfileId,
        dailyRouteId: dto.dailyRouteId ?? null,
        lat: dto.lat,
        lng: dto.lng,
        speed: dto.speed ?? null,
        heading: dto.heading ?? null,
      },
    });
  }

  async latestByDriver(driverId: string) {
    return this.prisma.locationLog.findFirst({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
  }
}