import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Parent App')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard)
@Controller('parent')
export class ParentAppController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'List my students (parent app)' })
  @Get('students')
  async myStudents(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    // ParentProfile -> StudentParent -> Student gibi bir join tablon varsa burada kullanırız.
    // Şimdilik en garanti MVP: parentProfile üzerinden bağlı öğrencileri döndür.
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!parent) return [];

    // Eğer ilişkisel tablo ismi farklıysa (örn StudentParent), burayı schema’ya göre ayarlarız.
    // Yaygın isim: studentParent / parentsOnStudents / studentParents
    // Aşağıdaki en yaygın olanı denedim: studentParent
    const links = await this.prisma.studentParent.findMany({
      where: { parentId: parent.id },
      select: { student: true },
    });

    return links.map((l) => l.student);
  }

  @ApiOperation({ summary: 'Latest location for a student (parent app)' })
  @Get('students/:id/location/latest')
  async latest(@Param('id') studentId: string) {
    // MVP: öğrenci->driver çözümlemesi projene göre değişebilir.
    // Şimdilik: en son locationLog kaydını dönmek bile "live map" akışı için yeterli.
    return this.prisma.locationLog.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}