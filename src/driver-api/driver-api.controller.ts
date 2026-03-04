import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DriverApiService } from './driver-api.service';

@ApiTags('Driver App')
@ApiBearerAuth('bearer')
@Controller('driver')
@UseGuards(JwtGuard, RolesGuard)
@Roles('DRIVER')
export class DriverApiController {
  constructor(private service: DriverApiService) {}

  @ApiOperation({ summary: 'Get my driver profile' })
  @ApiBearerAuth('bearer')
  @Get('profile')
  async profile(@Req() req: Request) {
    const userId = (req as any).user.sub as string;
    return this.service.getMyProfile(userId);
  }

  @ApiOperation({ summary: 'List my students' })
  @ApiBearerAuth('bearer')
  @Get('students')
  async myStudents(@Req() req: Request) {
    const userId = (req as any).user.sub as string;
    return this.service.getMyStudents(userId);
  }
}