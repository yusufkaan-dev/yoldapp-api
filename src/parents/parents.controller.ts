import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { CreateParentDto } from './dto/create-parent.dto';
import { ParentsService } from './parents.service';

@ApiTags('Admin - Parents')
@ApiBearerAuth('bearer')
@Controller('admin/parents')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class ParentsController {
  constructor(private readonly parents: ParentsService) {}

  @ApiOperation({ summary: 'Create new parent' })
  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parents.create(dto);
  }
}