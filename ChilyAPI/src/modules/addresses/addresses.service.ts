import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressRepository } from './addresses.repository';
import { UpdateAddressDto } from './dto/updateAddres.dto';

@Injectable()
export class AddressesService {
    constructor(private readonly addressRepository: AddressRepository) {}
    async getUserAddresses(id: number) {
        return await this.addressRepository.getUserAddresses(id);
    }
    async addNewAddress(addressCreate: CreateAddressDto) {
        return await this.addressRepository.addNewAddress(addressCreate);
    }
   async updateAddress(addressUpdate: UpdateAddressDto) {
        return await this.addressRepository.updateAddress(addressUpdate);
    }
}
