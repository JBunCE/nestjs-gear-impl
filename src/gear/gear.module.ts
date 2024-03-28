import { GearApi } from '@gear-js/api';
import { Module, Provider } from '@nestjs/common';
import { GearService } from './gear.service';
import { GearController } from './gear.controller';
import { ConfigModule } from '@nestjs/config';

const gearApiProvider: Provider = {
  provide: 'GEAR_API',
  useFactory: async () => {
    return await GearApi.create({
      providerAddress: 'wss://testnet.vara.network'
    });
  }
}

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [
        GearController
    ],
    providers: [
        gearApiProvider, 
        GearService
    ],
})
export class GearModule {}
