import { Injectable } from "@nestjs/common";
import { PdfDataDto } from "./pdf.dto";
import { Response } from "express";
import PDFDocumentWithTables from 'pdfkit-table';
@Injectable()
export class PdfService {

    async generatePdf(data: PdfDataDto, res: Response): Promise<Buffer> {

        const pdfPromise = new Promise<Buffer>((resolve, reject) => {
            const doc = new PDFDocumentWithTables({
                size: 'letter',
                bufferPages: true,
                autoFirstPage: false,
              });
              doc.addPage({
                margins: {
                  top: 50,
                  bottom: 50,
                  left: 72,
                  right: 72,
                },
              });    
            doc
            .image("src/common/helpers/chilly.jpg",  50, 55, { width: 120 })
            .fillColor("#444444")
            .text(process.env.RESTAURANT_NAME, 150, 100, { align: "center" })
            .moveDown();

            doc.pipe(res);

            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(49, 125).lineTo(541, 125).stroke(); // genera un espacio en blanco

            doc.fontSize(25).text(`Factura emitida por ${process.env.RESTAURANT_NAME}`, { align: 'center' });
    
            doc.fontSize(12).text(`Cliente: ${data.username}`);
            doc.text(`Email: ${data.email}`);
            doc.text(`Total: ${data.totalPrice}`);
    
            data.order.forEach(item => {
                doc.text(`Producto: ${item.name}`);
                doc.text(`Cantidad: ${item.quantity}`);
                doc.text(`Precio: ${item.price}`);
            });

            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(49, 125).lineTo(541, 125).stroke(); // genera un espacio en blanco

            doc.fontSize(15).text(`Total: ${data.totalPrice}`, { align: 'center' });
            doc.fontSize(16).text('Gracias por su compra', { align: 'center' });

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
              const data = Buffer.concat(buffer);
              resolve(data);
            });
            doc.on('error', reject);
            doc.end();
        });

        return pdfPromise;
    }
}