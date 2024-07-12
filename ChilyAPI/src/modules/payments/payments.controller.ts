import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DocumentationApiTagsModule } from "src/docs";
import { ProcessPaymentDto } from "./processPayment.dto";
import { CreatePaymentDto } from "./create-payment.dto";
import { TransactionInfo } from "./interfaces/TransactionInfo";

@Controller("payments")
@DocumentationApiTagsModule.clasification("Rutas para: Pagos con tarjeta")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("payment-intent")
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
  async getAllTransactionsByStripe() {
    return this.paymentsService.geAllTransactions();
  }


}
