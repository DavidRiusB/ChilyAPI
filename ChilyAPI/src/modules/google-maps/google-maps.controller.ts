import { Controller, Get, Query } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Controller('google-maps')
export class GoogleMapsController {
    constructor(private readonly googleMapsService: GoogleMapsService) {}
    @Get('')
    async getAddress(@Query('address') address: string) {
        return await this.googleMapsService.getAddress(address);
    }
}
