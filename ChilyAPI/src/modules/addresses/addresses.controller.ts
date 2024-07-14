import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { AddressesService } from "./addresses.service";
import { CreateAddressDto } from "./dto/createAddress.dto";
import { UpdateAddressDto } from "./dto/updateAddres.dto";
import {
  DocumentacionObtainAddresse,
  DocumentationAddNewAddress,
  DocumentationApiTagsModule,
  DocumentationDeleteAddress,
  DocumentationFindAllAddresses,
  DocumentationObtainUserAdress,
  DocumentationUpdateAddress
} from "src/docs";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Address } from "./entities/addresses.entity";

@Controller("addresses")
@DocumentationApiTagsModule.clasification("Rutas para: Domicilios")
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Get("/user")
  @UseGuards(JwtAuthGuard)
  @DocumentationObtainUserAdress()
  async getUserAddresses(@Query("id") id: number) {
    console.log(id);
    return await this.addressService.getUserAddresses(id);
  }

  @Get("/address")
  @UseGuards(JwtAuthGuard)
  @DocumentacionObtainAddresse()
  async getUserAddress(@Query("id") id: number) {
    return await this.addressService.getUserAddress(id);
  }

  @Get("all")
  @DocumentationFindAllAddresses()
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Post("/add")
  @UseGuards(JwtAuthGuard)
  @DocumentationAddNewAddress()
  async addNewAddress(@Body() addressCreate: CreateAddressDto) {
    return await this.addressService.addNewAddress(addressCreate);
  }

  @Put("/update")
  @UseGuards(JwtAuthGuard)
  @DocumentationUpdateAddress()
  async updateAddress(@Body() addressUpdate: UpdateAddressDto) {
    return await this.addressService.updateAddress(addressUpdate);
  }

  @Delete("/delete")
  @UseGuards(JwtAuthGuard)
  @DocumentationDeleteAddress()
  async deleteAddress(@Query("id") id: number) {
    return await this.addressService.deleteAddress(id);
  }
}
