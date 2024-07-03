// user.controller.doc.ts

import { UseGuards, applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { CreateAddressDto } from "src/modules/addresses/dto/createAddress.dto";
import { UpdateAddressDto } from "src/modules/addresses/dto/updateAddres.dto";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";

export function DocumentationObtainUserAdress() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: "Obtener direcciones de un usuario" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID del usuario",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Direcciones del usuario",
    }),
    ApiResponse({
      status: 404,
      description: "Usuario no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "ID de usuario inválido",
    }),
  );
}

export function DocumentacionObtainAddresse() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: "Obtener una dirección de un usuario" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID de la dirección",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Dirección del usuario",
    }),
    ApiResponse({
      status: 404,
      description: "Dirección no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "ID de dirección inválido",
    }),
  );
}

export function DocumentationAddNewAddress() {
  return applyDecorators(
    ApiOperation({ summary: "Add a new address for the user" }),
    ApiBody({ type: CreateAddressDto }),
    ApiResponse({ status: 201, description: "Address created successfully" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    UseGuards(JwtAuthGuard),
  );
}

export function DocumentationUpdateAddress() {
  return applyDecorators(
    ApiOperation({ summary: "Update an existing address" }),
    ApiBody({ type: UpdateAddressDto }),
    ApiResponse({ status: 200, description: "Address updated successfully" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    UseGuards(JwtAuthGuard),
  );
}

export function DocumentationDeleteAddress() {
  return applyDecorators(
    ApiOperation({ summary: "Delete an address by ID" }),
    ApiQuery({
      name: "id",
      type: Number,
      description: "ID of the address to delete",
    }),
    ApiResponse({ status: 200, description: "Address deleted successfully" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({ status: 404, description: "Address not found" }),
    UseGuards(JwtAuthGuard),
  );
}