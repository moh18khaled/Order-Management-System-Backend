import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { apiModule } from './api/api.module';

@Module({
  imports: [apiModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}