import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateParentDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          role: UserRole.PARENT,
        },
        select: { id: true, email: true, role: true, createdAt: true },
      });

      const parent = await this.prisma.parentProfile.create({
        data: {
          userId: user.id,
          institutionId: dto.institutionId,
          fullName: dto.fullName,
        },
        select: {
          id: true,
          institutionId: true,
          fullName: true,
          createdAt: true,
          user: { select: { id: true, email: true, role: true } },
        },
      });

      return parent;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create parent');
    }
  }
}
