export const orderConfirmationMailTemplate = (
  username: string,
  orderId: string,
  orderDetails: any[],
  total: number,
) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Orden en Donde Chily</title>
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
    /* Estilos para la tabla de detalles de la orden */
    .order-details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .order-details-table th, .order-details-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .order-details-table th {
      background-color: #EF2A39;
      color: white;
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
      <h2>¡Orden Generada Exitosamente en Donde Chily!</h2>
    </div>
    <div class="logo">
      <img src="https://scontent.fmex30-1.fna.fbcdn.net/v/t39.30808-6/294605266_729767591661554_8943081080553740766_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHQfsnzA7XBg4dow8-OEIfhV9_OOF-Ig9FX3844X4iD0dh0voqrjPq4TBVUKVjTWv-W-dl3T1WfvvkHhPEQDFfU&_nc_ohc=Kcg8Q9JQlbkQ7kNvgG1WJ3h&_nc_ht=scontent.fmex30-1.fna&oh=00_AYBN3AYE4LVmba1J4iDSop-GV8pZM3NL_7ExcuQkZeP4UA&oe=66841C46" alt="Chily Logo" style="max-width: 200px; height: auto;">
    </div>
    <div class="content">
      <p>Hola ${username},</p>
      <p>Tu orden ha sido generada exitosamente. El número de tu orden es <strong>${orderId}</strong>.</p>
      <p>Gracias por comprar en Donde Chily. Pronto recibirás más detalles sobre el envío y la entrega.</p>

      <h3>Detalles de la Orden</h3>
      <table class="order-details-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails
            .map(
              (detail) => `
            <tr>
              <td>${detail.product.name}</td>
              <td>${detail.quantity}</td>
              <td>${detail.price}</td>
              <td>${detail.total}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      <p><strong>Total de la Orden: </strong> ${total}</p>
    </div>
    <div class="footer">
      <p>Gracias por tu compra.</p>
      <p>Atentamente,</p>
      <p>El equipo de Donde Chily</p>
    </div>
  </div>
</body>
</html>
`;
