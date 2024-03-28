import { GearApi, GearKeyring, ProgramMetadata } from '@gear-js/api';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyJson } from '@polkadot/types/types';

@Injectable()
export class GearService {

    address: `0x${string}`;
    programId: `0x${string}`;
    metadata: ProgramMetadata;

    constructor(
        @Inject('GEAR_API') private gearApi: GearApi,
        private configService: ConfigService
    ) {
        this.address = configService.get<`0x${string}`>('ACCOUNT_ADDRESS');
        this.programId = configService.get<`0x${string}`>('PROGRAM_ADDRESS');
        this.metadata = ProgramMetadata.from(configService.get<`0x${string}`>('PROGRAM_METADATA'));
    }

    public chain(): any {
        return this.gearApi.chain();
    }

    public async fullState() {
        return await this.gearApi.programState.read({
            programId: this.programId,
            payload: '0x'
        }, this.metadata);
    }

    public async stakeMessage(amount: number) {
        const { seed } = GearKeyring.generateSeed(this.configService.get<string>('MNEMONIC'));
        const keyring = await GearKeyring.fromSeed(seed);

        const stakeExtrinsic = this.gearApi.tx.staking.bond((amount * 1000000000000), "staked")

        await stakeExtrinsic.signAndSend(
            keyring, ({status}: any) => {
                if (status.isInBlock) {
                    console.log(status.type);
                } else {
                    if (status.type === "Finalized") {
                        console.log(status.type);
                    }
                }
            }
        )

        return "staked"
    }

    public async sendMessage(payload: AnyJson) {
        const { seed } = GearKeyring.generateSeed(this.configService.get<string>('MNEMONIC'));
        const keyring = await GearKeyring.fromSeed(seed);

        const extrinsic = await this.createMessageExtrinsic(payload);

        await extrinsic.signAndSend(
            keyring, ({status}: any) => {
                if (status.isInBlock) {
                    console.log(status.type);
                } else {
                    if (status.type === "Finalized") {
                        console.log(status.type);
                    }
                }
            }
        )

        return "Message sent!"
    }

    private async createMessageExtrinsic(payload: AnyJson) {
        const gas = await this.gasLimit(payload);

        const message: any = {
            destination: this.programId,
            payload,
            gasLimit: BigInt(gas?.toHuman().min_limit?.toString().replace(/,/g, '') as string),
            value: 0,
        }

        return this.gearApi.message.send(message, this.metadata);
    }

    private gasLimit(payload: AnyJson) {
        return this.gearApi.program.calculateGas.handle(
            this.address,
            this.programId, 
            payload, 
            0,      
            false, 
            this.metadata,
        );
    }
}
