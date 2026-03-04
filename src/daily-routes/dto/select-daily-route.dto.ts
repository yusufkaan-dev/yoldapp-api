import { IsISO8601, IsOptional, IsUUID } from 'class-validator';

export class SelectDailyRouteDto {
  @IsUUID()
  routeTemplateId: string;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
