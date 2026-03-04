import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';

class AddRouteStopItemDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  plannedTime?: string; // "07:35"

  @IsOptional()
  lat?: string; // Decimal as string

  @IsOptional()
  lng?: string; // Decimal as string
}

export class AddRouteStopsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddRouteStopItemDto)
  stops: AddRouteStopItemDto[];
}