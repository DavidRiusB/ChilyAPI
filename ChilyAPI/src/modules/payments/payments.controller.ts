import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  DocumentationApiTagsModule,
  DocumentationCreatePaymentIntent,
  DocumentationGetAllTransactionsByStripe,
  DocumentationHandleCardPayment
} from "src/docs";
import { ProcessPaymentDto } from "./processPayment.dto";
import { CreatePaymentDto } from "./create-payment.dto";
import { TransactionInfo } from "./interfaces/TransactionInfo";

@Controller("payments")
@DocumentationApiTagsModule.clasification("Rutas para: Pagos con tarjeta")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("payment-intent")
  @DocumentationCreatePaymentIntent()
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const clientSecret =
        await this.paymentsService.createPaymentIntent(createPaymentDto);
      return { clientSecret };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("card-payment")
  @DocumentationHandleCardPayment()
  async handleCardPayment(@Body() handleCardPaymentDto: ProcessPaymentDto) {
    try {
      const paymentIntent =
        await this.paymentsService.handleCardPayment(handleCardPaymentDto);
      return { paymentIntent };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

 @Get("orders-info")
@DocumentationGetAllTransactionsByStripe()
async getAllTransactionsByStripe(
  @Query("page") page: number = 1,
  @Query("limit") limit: number = 10,
  @Query("date") date?: string,
  @Query("amount") amount?: number
) {
  return this.paymentsService.getAllTransactions(page, limit, date, amount);
}

}
