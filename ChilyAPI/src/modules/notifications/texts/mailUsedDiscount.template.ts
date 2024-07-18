// registration-mail.template.ts

export const UsedDiscountMailTemplate = (username: string, discount: number, code:string) => `
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
      <h2>¡Cupon de descuento en Donde Chily!</h2>
    </div>
    <div class="logo">
      <img src="${process.env.LOGOURL}" alt="Chily Logo" style="max-width: 200px; height: auto;">
    </div>
    <div class="content">
      <p>Hola ${username},</p>
      <p>Hemos notado que has usado tu cupon de descuento!!</p>
      <p>Tu cupon de descuento <strong>${code}</strong> ya no estara disponible para futuras compras,</p>
      <p>Ese cupon poseia un descuento del ${discount}%.</p>
      <br/>
      <p> Si no fuiste tu quien uso el cupon, ponte en contacto con el soporte de chily <a href="https://lo.de-chily.info/contact">aqui</a> \n, es posible que tu cuenta haya sido vulnerada!</p>
    </div>
    <div class="footer">
      <p>Gracias por seguir eligiendonos.</p>
      <p>Atentamente,</p>
      <p>El equipo de Donde Chily</p>
    </div>
  </div>
</body>
</html>
`;

