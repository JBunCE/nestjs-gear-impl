import { Body, Controller, Get, Post } from "@nestjs/common";
import { GearService } from "./gear.service";

@Controller('gear')
export class GearController {

    constructor(private service: GearService) {}

    @Get()
    public async network() {
        return this.service.chain();
    }

    @Get('full-state')
    public async fullState() {
        return this.service.fullState();
    }

    @Get('program-owner')
    public async programOwner() {
        return 'owner'
    }
    
    @Get('stake')
    public async stake() {
        return this.service.stakeMessage(10);
    }

    @Post('send-message')
    public async sendMessage(@Body() payload: any) {
        return this.service.sendMessage(payload);
    }

}