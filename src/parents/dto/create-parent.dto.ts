import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateParentDto {
  @ApiProperty({ example: 'anne.esra@yoldapp.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'parentpass', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'fbab19f1-38c9-4663-96c5-b41e9b48b55f' })
  @IsString()
  institutionId: string;

  @ApiProperty({ example: 'Anne Esra' })
  @IsString()
  fullName: string;
}