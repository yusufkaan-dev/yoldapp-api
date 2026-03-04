import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'driver99@yoldapp.local',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'driverpass',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'swagger-chrome',
    description: 'Client device identifier (used for session tracking)',
    minLength: 3,
    maxLength: 128,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  deviceId: string;
}