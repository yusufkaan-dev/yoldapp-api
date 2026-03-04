import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoutesService } from './routes.service';
import { CreateRouteTemplateDto } from './dto/create-route-template.dto';
import { AddRouteStopsDto } from './dto/add-route-stops.dto';

@ApiTags('Routes Admin')
@ApiBearerAuth('bearer')
@Controller('admin/route-templates')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class RoutesAdminController {
  constructor(private readonly routes: RoutesService) {}

  @Post()
  async create(@Body() dto: CreateRouteTemplateDto) {
    const created = await this.routes.createTemplate({
      institutionId: dto.institutionId,
      name: dto.name,
      direction: dto.direction,
      isActive: dto.isActive,
    });
    return { data: created };
  }

  @Get()
  async list(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('search') search?: string,
    @Query('institutionId') institutionId?: string,
    @Query('isActive') isActiveStr?: string,
  ) {
    const page = Math.max(1, Number(pageStr ?? 1));
    const limit = Math.min(100, Math.max(1, Number(limitStr ?? 20)));

    const isActive =
      isActiveStr === undefined
        ? undefined
        : isActiveStr === 'true'
          ? true
          : isActiveStr === 'false'
            ? false
            : undefined;

    return this.routes.listTemplates({ page, limit, search, institutionId, isActive });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const t = await this.routes.getTemplateDetail(id);
    return { data: t };
  }

  @Post(':id/stops')
  async addStops(@Param('id') id: string, @Body() dto: AddRouteStopsDto) {
    const stops = await this.routes.addStops(id, dto.stops);
    return { data: stops };
  }
}
