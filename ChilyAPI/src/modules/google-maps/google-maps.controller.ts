import { Controller, Get } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Controller('google-maps')
export class GoogleMapsController {
    constructor(private readonly googleMapsService: GoogleMapsService) {}
    @Get('')
    async getAddress() {
        return await this.googleMapsService.getAddress();
    }
}
