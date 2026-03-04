import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ListDriversQueryDto } from './dto/list-drivers.query';
import { DriversService } from './drivers.service';

@ApiTags('Admin - Drivers')
@ApiBearerAuth('bearer')
@Controller('admin/drivers')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @ApiOperation({ summary: 'Create new driver' })
  @Post()
  create(@Body() dto: CreateDriverDto) {
    return this.driversService.createDriver(dto);
  }

  @ApiOperation({ summary: 'List drivers (paginated)' })
  @Get()
  findAll(@Query() query: ListDriversQueryDto) {
    return this.driversService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
  }
}
