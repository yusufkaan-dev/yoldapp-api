import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateParentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  institutionId: string;

  @IsString()
  fullName: string;
}
