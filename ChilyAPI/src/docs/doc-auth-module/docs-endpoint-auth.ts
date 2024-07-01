import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
