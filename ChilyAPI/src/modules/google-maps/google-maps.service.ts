import { Client } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleMapsService {
    private client: Client;
    constructor()
     {
        this.client = new Client({});
     }

     async getAddress() {
        try {
            const response = await this.client.geocode({
                params: {
                    address: 'Buenos Aires, Aregentina',
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            })
            console.log(response);
        } catch (error){
            console.log(error)
        }
     }
}
