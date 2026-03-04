import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOperation({ summary: 'Login (returns accessToken + user)' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.auth.login(dto.email, dto.password, dto.deviceId);
    } catch (err: any) {
      console.error('LOGIN_ERROR', err?.message || err);
      console.error('LOGIN_STACK', err?.stack || err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get current token payload (session validation test)' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    return { user: (req as any).user };
  }
}