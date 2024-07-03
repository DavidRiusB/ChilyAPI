import { Injectable, BadRequestException } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { ProcessPaymentDto } from "./processPayment.dto";

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error(
        "La clave secreta de Stripe no está definida en las variables de entorno",
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    });
  }

  async processPayment({
    paymentMethodId,
    amount,
    currency,
  }: ProcessPaymentDto) {
    const amountInCents = Math.round(amount * 100);

    try {
      // Crear PaymentIntent con el PaymentMethodId recibido del frontend
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        payment_method: paymentMethodId,
        confirm: true,
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
