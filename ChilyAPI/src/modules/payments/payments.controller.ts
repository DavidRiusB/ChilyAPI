import { Controller, Post, Body } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./create-payment.dto";
import { HandleCardPaymentDto } from "./buy-payment.dto";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create-payment")
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    {
      const { amount, currency } = createPaymentDto;
      const clientSecret = await this.paymentsService.createPaymentIntent(
        amount,
        currency,
      );
      return { clientSecret };
    }
  }

  @Post("handle-card-payment")
  async handleCardPayment(@Body() body: HandleCardPaymentDto) {
    const { paymentIntentId, paymentMethodId } = body;
    const paymentIntent = await this.paymentsService.handleCardPayment(
      paymentIntentId,
      paymentMethodId,
    );
    return { paymentIntent };
  }
}