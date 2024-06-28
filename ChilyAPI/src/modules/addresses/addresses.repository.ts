import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Address } from "./entities/addresses.entity";
import { CreateAddressDto } from "./dto/createAddress.dto";
import { UserService } from "../user/user.service";
import { UpdateAddressDto } from "./dto/updateAddres.dto";

@Injectable()
export class AddressRepository {
    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService,
        private readonly dataSource: DataSource
) {}


    async getUserAddresses(id: number): Promise<Address[] | Error> {
        try {
            const address = await this.addressRepository.find({
                where: {
                    user: {
                        id: id
                    }
                }
            });
            if(!address.length) throw new Error("No hay direcciones para este usuario");
            return address;
        } catch (error){
            throw new NotFoundException(error.message);
        }
    }

    async addNewAddress(address: CreateAddressDto): Promise<Address | NotFoundException | ConflictException | InternalServerErrorException> {
        try {
            return this.dataSource.transaction(async (manager) => {
                const user = await this.userService.findUserById(address.id);
                if(!user) throw new NotFoundException("El usuario no existe");
                const newAddress = new Address();
                newAddress.city = address.city;
                newAddress.address = address.address;
                newAddress.postalCode = address.postalCode;
                newAddress.user = user;
                return await manager.save(newAddress);
            })
        } catch (error) {
            if(error.code == "23505") throw new ConflictException("Ya existe una dirección para este usuario")
            throw new InternalServerErrorException(error)
        }
    }
    async updateAddress(addressUpdate: UpdateAddressDto): Promise<Address | NotFoundException | InternalServerErrorException> {
        try {
            return this.dataSource.transaction(async(manager) => {
                const address = await this.addressRepository.findOneBy({id: addressUpdate.id});
                if(!address) throw new NotFoundException("La dirección no existe");
                address.city = addressUpdate.city;
                address.address = addressUpdate.address;
                address.postalCode = addressUpdate.postalCode;
                await manager.save(address);
                return address;
            })
        } catch (error) {
            if(error.code == "23505") throw new ConflictException("Esa dirección ya fue usada")
            throw new InternalServerErrorException(error)
        }
    }

        async deleteAddress(id: number) {
        try {
            const address = await this.addressRepository.findOne({ where: { id: id}});
            if(!address) throw new NotFoundException("La dirección no existe");
            return await this.addressRepository.delete(id);
        } catch (error) {   
            if(error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error)
        }
    }
}