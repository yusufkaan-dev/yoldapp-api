import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string, deviceId: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // DRIVER: tek aktif session (device2 login -> device1 token revoke)
    if (user.role === UserRole.DRIVER) {
      await this.prisma.userSession.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // userId+deviceId UNIQUE => create değil upsert
    const session = await this.prisma.userSession.upsert({
      where: {
        userId_deviceId: { userId: user.id, deviceId },
      },
      update: { revokedAt: null },
      create: { userId: user.id, deviceId, revokedAt: null },
      select: { id: true },
    });

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      email: user.email,
      sid: session.id,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}