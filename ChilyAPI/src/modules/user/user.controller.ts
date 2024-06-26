import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '../auth/dto/user.dto';
import { UserUpdateDto } from './user-update.dto';
import {
  DocumentationApiTagsModule,
  DocumentacionUserGetAllUsers,
  DocumentationGetUserById,
  DocumentationUpdateUser,
  DocumentationSoftDeleteUser,
} from 'src/docs';

@Controller('user')
@DocumentationApiTagsModule.clasification('Rutas para: Usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @DocumentacionUserGetAllUsers()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.userService.findAll({ page, limit });
  }

  @Get(':id')
  @DocumentationGetUserById()
  async getUserbyId(@Param('id') id: number) {
    return await this.userService.findUserById(id);
  }

  @Put(':id')
  @DocumentationUpdateUser()
  async updateUser(@Param('id') id: number, @Body() userData: UserUpdateDto) {
    return await this.userService.update(userData, id);
  }

  @Delete(':id')
  @DocumentationSoftDeleteUser()
  async softDeleteUser(@Param('id') id: number) {
    const user = await this.userService.softDelete(id);
    return user;
  }
}
