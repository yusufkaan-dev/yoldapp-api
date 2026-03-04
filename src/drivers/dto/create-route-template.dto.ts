import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export enum RouteDirectionDto {
  AM = 'AM',
  PM = 'PM',
}

export class CreateRouteTemplateDto {
  @IsUUID()
  institutionId: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(RouteDirectionDto)
  direction: RouteDirectionDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}