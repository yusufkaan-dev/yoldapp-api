import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentAppModule } from './parent-app/parent-app.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DriverApiModule } from './driver-api/driver-api.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { DriversModule } from './drivers/drivers.module';
import { LocationModule } from './location/location.module';
import { RoutesModule } from './routes/routes.module';
import { DailyRoutesModule } from './daily-routes/daily-routes.module';
import { ParentAppController } from './parent-app.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ParentAppController],
})
export class ParentAppModule {}
@Module({
 imports: [
  // ... diğer modüller
  LocationModule,
  ParentAppModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    DriversModule,
    InstitutionsModule,
    ParentsModule,
    StudentsModule,
    DriverApiModule,

    // NEW
    RoutesModule,
    DailyRoutesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}