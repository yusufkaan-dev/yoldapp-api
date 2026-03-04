import { Module } from '@nestjs/common';
import { DailyRoutesService } from './daily-routes.service';
import { DailyRoutesDriverController } from './daily-routes.driver.controller';

@Module({
  controllers: [DailyRoutesDriverController],
  providers: [DailyRoutesService],
})
export class DailyRoutesModule {}
