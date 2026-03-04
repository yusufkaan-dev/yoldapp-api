import { IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  institutionId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  parentId: string; // first parent
}