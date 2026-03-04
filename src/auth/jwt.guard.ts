import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];

    if (!auth || typeof auth !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload?.sub || !payload?.sid) {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.prisma.userSession.findFirst({
      where: { id: payload.sid, userId: payload.sub, revokedAt: null },
      select: { id: true },
    });

    if (!session) throw new UnauthorizedException('Session revoked');

    req.user = payload; // { sub, role, email, sid }
    return true;
  }
}