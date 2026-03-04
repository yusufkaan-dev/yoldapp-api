import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverApiService {
  constructor(private prisma: PrismaService) {}

  // GET /driver/profile
  async getMyProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        institutionId: true,
        fullName: true,
        phone: true,
        createdAt: true,
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!profile) throw new NotFoundException('Driver profile not found');
    return profile;
  }

  // GET /driver/students
  async getMyStudents(userId: string) {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId },
      select: { institutionId: true },
    });

    if (!driver) throw new NotFoundException('Driver profile not found');

    return this.prisma.student.findMany({
      where: { institutionId: driver.institutionId },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }
}