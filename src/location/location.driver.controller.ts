import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('LocationDriver')
@ApiBearerAuth('bearer')
@UseGuards(JwtGuard)
@Controller('location')
export class LocationDriverController {
  constructor(private readonly locationService: LocationService) {}

  @Post('ping')
  async ping(@Req() req: Request, @Body() dto: CreateLocationDto) {
    const userId = (req as any).user?.sub;
    return this.locationService.ingestDriverLocation(userId, dto);
  }
}