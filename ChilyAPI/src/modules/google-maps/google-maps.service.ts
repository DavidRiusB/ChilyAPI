import { Client, UnitSystem } from '@googlemaps/google-maps-services-js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EstimatedTime } from './dto/estimatedTime.dto';

@Injectable()
export class GoogleMapsService {
    private client: Client;
    constructor()
     {
        this.client = new Client({});
     }

     async getAddress(address: string) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            })
            return response.data.results[0];
        } catch (error){
            throw new InternalServerErrorException(error);
        }
     }

     async getEstimatedTime(data: EstimatedTime): Promise<{ duration: string, distance: string}> {
        try {
            const response = await this.client.distancematrix({
                params: {
                    origins: [{ lat: data.origin.lat, lng: data.origin.lng }],
                    destinations: [{ lat: data.destination.lat, lng: data.destination.lng }],
                    mode: data.mode,
                    units: UnitSystem.metric,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });
            return {duration: response.data.rows[0].elements[0].duration.text,
                    distance: response.data.rows[0].elements[0].distance.text
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
     }
     async convertAddressToLatLng(address: string) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            })
            return response.data.results[0].geometry.location;
        } catch (error) {   
            throw new InternalServerErrorException(error);
        }
     }
}
