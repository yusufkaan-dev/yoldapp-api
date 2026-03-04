import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';

class AddRouteStopItemDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  plannedTime?: string;

  @IsOptional()
  lat?: string;

  @IsOptional()
  lng?: string;
}

export class AddRouteStopsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddRouteStopItemDto)
  stops: AddRouteStopItemDto[];
}
