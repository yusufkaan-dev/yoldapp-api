import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationDriverController } from './location.driver.controller';

@Module({
  controllers: [LocationDriverController],
  providers: [LocationService],
})
export class LocationModule {}