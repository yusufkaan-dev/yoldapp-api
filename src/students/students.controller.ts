import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/students')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class StudentsController {
  constructor(private students: StudentsService) {}

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.students.create(dto);
  }

  @Post(':id/parents')
  addParent(@Param('id') id: string, @Body() body: { parentId: string }) {
    return this.students.addParent(id, body.parentId);
  }
}