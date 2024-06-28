import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddres.dto';
import { DocumentationApiTagsModule } from 'src/docs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('addresses')
@DocumentationApiTagsModule.clasification('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}
  @Get('/test')
  async test() {
    return 'hello wlr';
  }
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUserAddresses(@Query('id') id: number) {
    console.log(id);
    return await this.addressService.getUserAddresses(id);
  }

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async addNewAddress(@Body() addressCreate: CreateAddressDto) {
    return await this.addressService.addNewAddress(addressCreate);
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Body() addressUpdate: UpdateAddressDto) {
    return await this.addressService.updateAddress(addressUpdate);
  }
}
