import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiResponse } from "@nestjs/swagger";

export function DocumentationLogin() {
  return applyDecorators(
    ApiOperation({ summary: "Iniciar sesión" }),
    ApiResponse({ status: 200, description: "Inicio de sesión exitoso." }),
    ApiResponse({
      status: 401,
      description: "Correo eletrónico o contraseña incorrectos",
    }),
  );
}

export function DocumentationRegister() {
  return applyDecorators(
    ApiOperation({ summary: "Registrarse" }),
    ApiResponse({ status: 200, description: "Registro exitoso" }),
    ApiResponse({
      status: 400,
      description: "Solicitud incorrecta. Verifica los datos",
    }),
    ApiResponse({ status: 400, description: "El usuario ya existe" }),
  );
}

export function DocumentationLoginGoogle() {
  return applyDecorators(
    ApiOperation({ summary: "Login con Google" }),
    ApiResponse({
      status: 200,
      description: "Login exitoso",
    }),
    ApiResponse({
      status: 401,
      description: "Credenciales inválidas",
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos",
    }),
  );
}

export class DocumentationUserLoginGoogleDto {
  static email() {
    return applyDecorators(
      ApiProperty({
        description: "Correo electrónico del usuario",
        example: "googlegerente@dondechily.com",
      }),
    );
  }

  static names() {
    return applyDecorators(
      ApiProperty({
        description: "Nombre del usuario",
        example: "Gerente Juan",
      }),
    );
  }
}

export function DocumentationRequestPasswordReset() {
  return applyDecorators(
    ApiOperation({ summary: "Solicitar restablecimiento de contraseña" }),
    ApiResponse({
      status: 200,
      description: "Solicitud de restablecimiento de contraseña exitosa",
    }),
    ApiResponse({
      status: 400,
      description: "Por favor ingrese tu email",
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor",
    }),
  );
}

export function DocumentationResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: "Restablecer contraseña" }),
    ApiResponse({
      status: 200,
      description: "Contraseña restablecida exitosamente",
    }),
    ApiResponse({
      status: 400,
      description: "Contraseña y token requeridos",
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor",
    }),
  );
}
