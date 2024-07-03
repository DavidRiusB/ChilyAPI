import { TravelMode } from "@googlemaps/google-maps-services-js";

export class EstimatedTime {
    origin: { lat: number, lng: number};
    destination: { lat: number, lng: number };
    mode: TravelMode;
}

