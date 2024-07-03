import { Controller, Get, Query } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps.service";
import {
  DocumentacionObteinAddress,
  DocumentationApiTagsModule,
} from "src/docs";

@Controller("google-maps")
@DocumentationApiTagsModule.clasification("Rutas para: Google Maps")
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}
    @Get("")
  @DocumentacionObteinAddress()
  async getAddress(@Query("address") address: string) {
    return await this.googleMapsService.getAddress(address);
  }
}
