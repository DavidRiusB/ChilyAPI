import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressRepository } from './addresses.repository';
import { UpdateAddressDto } from './dto/updateAddres.dto';
import { Address } from './entities/addresses.entity';

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepository: AddressRepository) {}
  async findAll(): Promise<Address[]> {
    return this.addressRepository.findAllAddresses();
  }

  async getUserAddresses(id: number) {
    return await this.addressRepository.getUserAddresses(id);
  }
  async getUserAddress(id: number) {
    return await this.addressRepository.getUserAddress(id);
  }
  async addNewAddress(addressCreate: CreateAddressDto) {
    return await this.addressRepository.addNewAddress(addressCreate);
  }
  async updateAddress(addressUpdate: UpdateAddressDto) {
    return await this.addressRepository.updateAddress(addressUpdate);
  }
  async deleteAddress(id: number) {
    return await this.addressRepository.deleteAddress(id);
  }
}
