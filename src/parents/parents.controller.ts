import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateParentDto } from './dto/create-parent.dto';
import { ParentsService } from './parents.service';

@Controller('admin/parents')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class ParentsController {
  constructor(private parents: ParentsService) {}

  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parents.create(dto);
  }
}
