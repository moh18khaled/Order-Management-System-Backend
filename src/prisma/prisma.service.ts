import { Injectable,OnModuleInit ,OnModuleDestroy} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy{
    
  constructor(private prisma: PrismaClient) {}

 
  async onModuleInit() {
    await this.prisma.$connect();
    console.log('database connected.');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('database disconnected');
  }
}
