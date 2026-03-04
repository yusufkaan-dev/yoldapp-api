import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ParentAppController } from './parent-app.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ParentAppController],
})
export class ParentAppModule {}