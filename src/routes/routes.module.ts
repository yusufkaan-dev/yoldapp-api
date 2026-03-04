import { Module } from '@nestjs/common';
import { RoutesAdminController } from './routes.admin.controller';
import { RoutesService } from './routes.service';

@Module({
  controllers: [RoutesAdminController],
  providers: [RoutesService],
})
export class RoutesModule {}