import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const student = await this.prisma.student.create({
      data: {
        institutionId: dto.institutionId,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    await this.prisma.studentParent.create({
      data: {
        studentId: student.id,
        parentId: dto.parentId,
      },
    });

    return student;
  }

  async addParent(studentId: string, parentId: string) {
    const count = await this.prisma.studentParent.count({
      where: { studentId },
    });

    if (count >= 2) {
      throw new ConflictException('Student already has 2 parents');
    }

    return this.prisma.studentParent.create({
      data: { studentId, parentId },
    });
  }
}