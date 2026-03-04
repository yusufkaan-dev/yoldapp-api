import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { DailyRoutesService } from './daily-routes.service';
import { SelectDailyRouteDto } from './dto/select-daily-route.dto';

@Controller('driver')
@UseGuards(JwtGuard, RolesGuard)
@Roles('DRIVER')
export class DailyRoutesDriverController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dailyRoutes: DailyRoutesService,
  ) {}

  private async getDriverProfileId(userId: string) {
    const dp = await this.prisma.driverProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!dp) throw new Error('Driver profile missing');
    return dp.id;
  }

  @Get('routes')
  async listRoutes(@Req() req: any) {
    const driverProfileId = await this.getDriverProfileId(req.user.sub);
    const templates = await this.dailyRoutes.listDriverTemplates(driverProfileId);
    return { data: templates };
  }

  @Post('daily-routes/select')
  async select(@Req() req: any, @Body() dto: SelectDailyRouteDto) {
    const driverProfileId = await this.getDriverProfileId(req.user.sub);
    const date = dto.date ? new Date(dto.date) : undefined;

    const daily = await this.dailyRoutes.selectOrCreateDailyRoute({
      routeTemplateId: dto.routeTemplateId,
      driverProfileId,
      date,
    });

    return { data: daily };
  }

  @Get('daily-routes/:id/stops')
  async stops(@Req() req: any, @Param('id') id: string) {
    const driverProfileId = await this.getDriverProfileId(req.user.sub);
    const stops = await this.dailyRoutes.getStops(id, driverProfileId);
    return { data: stops };
  }

  @Post('daily-routes/:id/start')
  async start(@Req() req: any, @Param('id') id: string) {
    const driverProfileId = await this.getDriverProfileId(req.user.sub);
    const updated = await this.dailyRoutes.startDailyRoute(id, driverProfileId);
    return { data: updated };
  }

  @Post('daily-routes/:id/finish')
  async finish(@Req() req: any, @Param('id') id: string) {
    const driverProfileId = await this.getDriverProfileId(req.user.sub);
    const updated = await this.dailyRoutes.finishDailyRoute(id, driverProfileId);
    return { data: updated };
  }
}
