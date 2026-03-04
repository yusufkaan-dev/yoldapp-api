import { Module } from '@nestjs/common';
import { DriverApiController } from './driver-api.controller';
import { DriverApiService } from './driver-api.service';

@Module({
  controllers: [DriverApiController],
  providers: [DriverApiService],
})
export class DriverApiModule {}
