export const passwordReset = (resetUrl: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecimiento de contraseña</title>
  <style>
    /* Estilos generales para el cuerpo del correo */
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    /* Estilos para el contenedor principal */
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    /* Estilos para el encabezado */
    .header {
      background-color: #EF2A39; /* Color de fondo del encabezado */
      color: #fff;
      text-align: center;
      padding: 20px 0; /* Aumento del espacio alrededor del texto del encabezado */
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    /* Estilos para el logo */
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    /* Estilos para el cuerpo del contenido */
    .content {
      padding: 20px 0; /* Aumento del espacio interno del contenido */
    }
    /* Estilos para el pie de página */
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
      text-align: center; /* Alineación del texto en el pie de página */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Restablecimiento de contraseña</h2>
    </div>
    <div class="logo">
      <img src="${process.env.LOGOURL}" alt="Chily Logo" style="max-width: 200px; height: auto;">
    </div>
    <div class="content">
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para proceder:</p>
      <p><a href="${resetUrl}">Restablecer Contraseña</a></p>
      <p>Si no solicitaste este restablecimiento, ignora este mensaje.</p>
    </div>
    <div class="footer">
      <p>Atentamente,</p>
      <p>El equipo de tu aplicación</p>
    </div>
  </div>
</body>
</html>
`;
