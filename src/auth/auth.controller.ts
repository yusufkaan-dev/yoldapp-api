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
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password, dto.deviceId);
  }

  @ApiOperation({ summary: 'Get current token payload (session validation test)' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    return { user: (req as any).user };
  }
}