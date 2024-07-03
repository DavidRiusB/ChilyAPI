import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";

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

  async createPaymentIntent(amount: number, currency: string) {
    const amountInCents = Math.round(amount * 100); // pendiente de verificar con respecto a cosots en colombia

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
      });
      return paymentIntent.client_secret;
    } catch (error) {
      throw new Error("Error al crear el intento de pago con Stripe");
    }
  }

  async handleCardPayment(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        },
      );
      return paymentIntent;
    } catch (error) {
      throw new Error("Error al procesar el pago con tarjeta con Stripe");
    }
  }
}
