import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsOptional()
  @IsString()
  dailyRouteId?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;
}