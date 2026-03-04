import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async createDriver(dto: CreateDriverDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const institution = await tx.institution.findUnique({
          where: { id: dto.institutionId },
          select: { id: true },
        });
        if (!institution) throw new NotFoundException('Institution not found');

        const user = await tx.user.create({
          data: {
            email: dto.email.toLowerCase(),
            passwordHash,
            role: UserRole.DRIVER,
          },
          select: { id: true, email: true, role: true, createdAt: true },
        });

        const profile = await tx.driverProfile.create({
          data: {
            userId: user.id,
            institutionId: dto.institutionId,
            fullName: dto.fullName,
            phone: dto.phone,
          },
          select: {
            id: true,
            institutionId: true,
            fullName: true,
            phone: true,
            createdAt: true,
          },
        });

        return { user, profile };
      });

      return created;
    } catch (e: any) {
      if (e?.status) throw e;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('Email already exists');
        if (e.code === 'P2003') throw new ConflictException('Invalid foreign key relation');
      }

      throw e;
    }
  }

  // (geriye dönük uyumluluk) eskiden kullanılan liste
  async listDrivers() {
    return this.prisma.driverProfile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        phone: true,
        createdAt: true,
        institution: { select: { id: true, name: true } },
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }

  // yeni: pagination + search
  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const search = params?.search?.trim();

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.driverProfile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fullName: true,
          phone: true,
          createdAt: true,
          institution: { select: { id: true, name: true } },
          user: { select: { id: true, email: true, role: true } },
        },
      }),
      this.prisma.driverProfile.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }
}