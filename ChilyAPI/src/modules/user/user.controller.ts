import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
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
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard)
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
