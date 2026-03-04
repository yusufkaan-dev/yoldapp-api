import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { DriverApiModule } from './driver-api/driver-api.module';
import { RoutesModule } from './routes/routes.module';
import { DailyRoutesModule } from './daily-routes/daily-routes.module';
import { LocationModule } from './location/location.module';

import { ParentAppModule } from './parent-app/parent-app.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DriversModule,
    InstitutionsModule,
    ParentsModule,
    StudentsModule,
    DriverApiModule,
    RoutesModule,
    DailyRoutesModule,
    LocationModule,
    ParentAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}