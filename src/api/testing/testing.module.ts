import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { PrismaModule } from 'src/prisma/prisma.Module';

@Module({
  imports: [PrismaModule],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
