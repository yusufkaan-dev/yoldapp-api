import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionsService } from './institutions.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/institutions')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class InstitutionsController {
  constructor(private institutions: InstitutionsService) {}

  @Post()
  create(@Body() dto: CreateInstitutionDto) {
    return this.institutions.create(dto.name);
  }

  @Get()
  findAll() {
    return this.institutions.findAll();
  }
}
