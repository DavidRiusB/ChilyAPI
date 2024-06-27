import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DocumentationLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' }),
    ApiResponse({
      status: 401,
      description: 'Correo eletrónico o contraseña incorrectos',
    }),
  );
}

export function DocumentationRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrarse' }),
    ApiResponse({ status: 200, description: 'Registro exitoso' }),
    ApiResponse({
      status: 400,
      description: 'Solicitud incorrecta. Verifica los datos',
    }),
    ApiResponse({ status: 400, description: 'El usuario ya existe' }),
  );
}

export function DocumentationLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Cerrar sesión' }),
    ApiBody({
      description: 'Datos necesarios para cerrar sesión',
    }),
    ApiResponse({
      status: 200,
      description: 'Cierre de sesión exitoso',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}

export function DocumentationLoginGoogle() {
  return applyDecorators(
    ApiOperation({ summary: 'Login con Google' }),
    ApiResponse({
      status: 200,
      description: 'Login exitoso',
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciales inválidas',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}
