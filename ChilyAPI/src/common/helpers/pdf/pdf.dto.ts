export class PdfDataDto {
    order: {
        name: string;
        quantity: number;
        price: number;
    }[];
    email: string;
    username: string;
    totalPrice: number;
}