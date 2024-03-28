import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GearModule } from './gear/gear.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    GearModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
