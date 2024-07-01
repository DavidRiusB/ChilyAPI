// registration-mail.template.ts

export const registrationMailTemplate = (username: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro exitoso en Donde Chily</title>
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
      <h2>¡Registro exitoso en Donde Chily!</h2>
    </div>
    <div class="logo">
      <img src="https://scontent.fmex30-1.fna.fbcdn.net/v/t39.30808-6/294605266_729767591661554_8943081080553740766_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHQfsnzA7XBg4dow8-OEIfhV9_OOF-Ig9FX3844X4iD0dh0voqrjPq4TBVUKVjTWv-W-dl3T1WfvvkHhPEQDFfU&_nc_ohc=Kcg8Q9JQlbkQ7kNvgG1WJ3h&_nc_ht=scontent.fmex30-1.fna&oh=00_AYBN3AYE4LVmba1J4iDSop-GV8pZM3NL_7ExcuQkZeP4UA&oe=66841C46" alt="Chily Logo" style="max-width: 200px; height: auto;">
    </div>
    <div class="content">
      <p>Hola ${username},</p>
      <p>Te damos la bienvenida a Chily. Tu registro ha sido completado exitosamente.</p>
      <p>Ahora puedes disfrutar de todos nuestros servicios.</p>
    </div>
    <div class="footer">
      <p>Gracias por unirte a nosotros.</p>
      <p>Atentamente,</p>
      <p>El equipo de Donde Chily</p>
    </div>
  </div>
</body>
</html>
`;
