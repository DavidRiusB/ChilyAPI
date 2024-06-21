import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DocsApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' }),
    ApiResponse({
      status: 401,
      description: 'Correo electrónico o contraseña incorrectos.',
    }),
  );
}

export function DocsApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrarse' }),
    ApiResponse({ status: 200, description: 'Registro exitoso.' }),
    ApiResponse({
      status: 500,
      description: 'Error inesperado al generar credenciales.',
    }),
    ApiResponse({ status: 409, description: 'El usuario ya existe.' }),
  );
}
