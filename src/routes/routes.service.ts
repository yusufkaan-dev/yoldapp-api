import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(input: {
    institutionId: string;
    name: string;
    direction: 'AM' | 'PM';
    isActive?: boolean;
  }) {
    const inst = await this.prisma.institution.findUnique({ where: { id: input.institutionId } });
    if (!inst) throw new NotFoundException('Institution not found');

    return this.prisma.routeTemplate.create({
      data: {
        institutionId: input.institutionId,
        name: input.name.trim(),
        direction: input.direction,
        isActive: input.isActive ?? true,
      },
    });
  }

  async listTemplates(params: {
    page: number;
    limit: number;
    search?: string;
    institutionId?: string;
    isActive?: boolean;
  }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.institutionId) where.institutionId = params.institutionId;
    if (typeof params.isActive === 'boolean') where.isActive = params.isActive;

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [{ name: { contains: q, mode: 'insensitive' } }];
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.routeTemplate.count({ where }),
      this.prisma.routeTemplate.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          institution: { select: { id: true, name: true } },
          _count: { select: { stops: true } },
        },
      }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async addStops(
    routeTemplateId: string,
    stops: Array<{
      studentId: string;
      order: number;
      plannedTime?: string;
      lat?: string;
      lng?: string;
    }>,
  ) {
    if (!stops.length) throw new BadRequestException('Stops array is empty');

    const template = await this.prisma.routeTemplate.findUnique({
      where: { id: routeTemplateId },
      select: { id: true, institutionId: true },
    });
    if (!template) throw new NotFoundException('Route template not found');

    const orders = stops.map((s) => s.order);
    const orderSet = new Set(orders);
    if (orderSet.size !== orders.length) throw new BadRequestException('Duplicate order values in request');

    const studentIds = stops.map((s) => s.studentId);
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, institutionId: true },
    });
    if (students.length !== studentIds.length) throw new NotFoundException('Some students not found');

    const bad = students.find((s) => s.institutionId !== template.institutionId);
    if (bad) throw new ConflictException('Some students belong to a different institution');

    await this.prisma.routeStop.createMany({
      data: stops.map((s) => ({
        routeTemplateId,
        studentId: s.studentId,
        order: s.order,
        plannedTime: s.plannedTime,
        lat: s.lat ? s.lat : undefined,
        lng: s.lng ? s.lng : undefined,
      })),
      skipDuplicates: false,
    });

    return this.prisma.routeStop.findMany({
      where: { routeTemplateId },
      orderBy: { order: 'asc' },
      include: { student: true },
    });
  }

  async getTemplateDetail(routeTemplateId: string) {
    const t = await this.prisma.routeTemplate.findUnique({
      where: { id: routeTemplateId },
      include: {
        institution: { select: { id: true, name: true } },
        stops: { orderBy: { order: 'asc' }, include: { student: true } },
      },
    });
    if (!t) throw new NotFoundException('Route template not found');
    return t;
  }
}
