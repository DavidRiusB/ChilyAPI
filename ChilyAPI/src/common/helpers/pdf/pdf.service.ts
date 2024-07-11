// import { Injectable } from "@nestjs/common";
// import { PdfDataDto } from "./pdf.dto";
// import { Response } from "express";
// import PDFDocumentWithTables from "pdfkit-table";
// @Injectable()
// export class PdfService {
//   async generatePdf(data: PdfDataDto, res: Response): Promise<Buffer> {
//     const pdfPromise = new Promise<Buffer>((resolve, reject) => {
//       const doc = new PDFDocumentWithTables({
//         size: "letter",
//         bufferPages: true,
//         autoFirstPage: false,
//       });
//       doc.addPage({
//         margins: {
//           top: 50,
//           bottom: 50,
//           left: 72,
//           right: 72,
//         },
//       });
//       doc
//         .image("src/common/helpers/chilly.jpg", 50, 55, { width: 120 })
//         .fillColor("#444444")
//         .text(process.env.RESTAURANT_NAME, 150, 100, { align: "center" })
//         .moveDown();

//       doc.pipe(res);

//       doc
//         .strokeColor("#aaaaaa")
//         .lineWidth(1)
//         .moveTo(49, 125)
//         .lineTo(541, 125)
//         .stroke(); // genera un espacio en blanco

//       doc
//         .fontSize(25)
//         .text(`Factura emitida por ${process.env.RESTAURANT_NAME}`, {
//           align: "center",
//         });

//       doc.fontSize(12).text(`Cliente: ${data.username}`);
//       doc.text(`Email: ${data.email}`);
//       doc.text(`Total: ${data.totalPrice}`);

//       data.order.forEach((item) => {
//         doc.text(`Producto: ${item.name}`);
//         doc.text(`Cantidad: ${item.quantity}`);
//         doc.text(`Precio: ${item.price}`);
//       });

//       doc
//         .strokeColor("#aaaaaa")
//         .lineWidth(1)
//         .moveTo(49, 125)
//         .lineTo(541, 125)
//         .stroke(); // genera un espacio en blanco

//       doc.fontSize(15).text(`Total: ${data.totalPrice}`, { align: "center" });
//       doc.fontSize(16).text("Gracias por su compra", { align: "center" });

//       const buffer = [];
//       doc.on("data", buffer.push.bind(buffer));
//       doc.on("end", () => {
//         const data = Buffer.concat(buffer);
//         resolve(data);
//       });
//       doc.on("error", reject);
//       doc.end();
//     });

//     return pdfPromise;
//   }
// }
import { Injectable } from "@nestjs/common";
import { PdfDataDto } from "./pdf.dto";
import { Response } from "express";
import PDFDocumentWithTables from "pdfkit-table";

@Injectable()
export class PdfService {
  async generatePdf(data: PdfDataDto, res: Response): Promise<Buffer> {
    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocumentWithTables({
        size: "letter",
        bufferPages: true,
        autoFirstPage: false,
      });

      // Register fonts
      doc.registerFont(
        "Helvetica-Bold",
        "src/common/helpers/Helvetica-Bold.ttf",
      );
      doc.registerFont("Helvetica", "src/common/helpers/Helvetica.ttf");

      doc.addPage({
        margins: {
          top: 50,
          bottom: 50,
          left: 72,
          right: 72,
        },
      });

      // Header with logo and restaurant name
      const pageWidth = doc.page.width;
      const imageWidth = 80;
      const imageX = (pageWidth - imageWidth) / 5;

      doc
        .image("src/common/helpers/chilly.jpg", imageX, 45, {
          width: imageWidth,
        })
        .moveDown(1);

      doc
        .fontSize(12)
        .text(`Dirección del restaurante: ${process.env.RESTAURANT_ADDRESS}`, {
          align: "right",
        })
        .moveDown(0.5);

      doc
        .text(`Nombre del restaurante ${process.env.RESTAURANT_NAME}`, {
          align: "right",
        })
        .moveDown(2);

      // Decorative line
      doc
        .strokeColor("#444444")
        .lineWidth(1)
        .moveTo(50, 160)
        .lineTo(550, 160)
        .stroke();

      // Invoice title
      doc.fontSize(18).text("Factura", { align: "center" }).moveDown(2);

      // Customer information
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Información del Cliente", { align: "center", underline: true })

        .moveDown(1)
        .font("Helvetica")
        .text(`Nombre: ${data.username}`, { align: "center" })
        .moveDown(1)
        .text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "center" })
        .moveDown(1)
        .text(`Email: ${data.email}`, { align: "center" })
        .moveDown(2);

      // Order details title
      doc
        .font("Helvetica-Bold")
        .text("Detalles de la Orden", { align: "center", underline: true })
        .moveDown(1);

      // Order details table
      const table = {
        headers: ["Producto", "Cantidad", "Precio Unitario", "Subtotal"],
        rows: data.order.map((item) => [
          item.name,
          item.quantity.toString(),
          `$${item.price.toFixed(2)}`,
          `$${(item.price * item.quantity).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
        prepareRow: () => doc.font("Helvetica").fontSize(10),
        width: 500,
        x: doc.page.width / 2 - 250,
        y: doc.y,
      });

      // Total amount
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`Total: $${data.totalPrice.toFixed(2)}`, { align: "center" })
        .moveDown(2);

      // Thank you note
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Gracias por su compra", { align: "center", lineGap: 10 })
        .moveDown(2);

      // Footer with additional information
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Esta factura es una representación de los productos comprados en nuestro restaurante.",
          { align: "center", width: 500 },
        )
        .moveDown(1)
        .text(
          "Si tiene alguna pregunta, no dude en ponerse en contacto con nosotros.",
          { align: "center", width: 500 },
        )
        .moveDown(2);

      // Stream the PDF to the response
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);
      doc.end();

      const buffer = [];
      doc.on("data", buffer.push.bind(buffer));
      doc.on("end", () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.on("error", reject);
    });

    return pdfPromise;
  }
}
