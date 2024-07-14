import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { ProcessPaymentDto } from "./processPayment.dto";
import { CreatePaymentDto } from "./create-payment.dto";
import { Transaction } from "typeorm";
import { TransactionInfo } from "./interfaces/TransactionInfo";

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error(
        "La clave secreta de Stripe no está definida en las variables de entorno"
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20"
    });
  }

  async createPaymentIntent(
    processPaymentDto: CreatePaymentDto
  ): Promise<string> {
    const { amount, currency } = processPaymentDto;
    const amountInCents = Math.round(amount * 100);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency
      });
      return paymentIntent.client_secret;
    } catch (error) {
      throw new Error("Error al crear el intento de pago con Stripe");
    }
  }

  async handleCardPayment(
    processPaymentDto: ProcessPaymentDto
  ): Promise<Stripe.PaymentIntent> {
    const { paymentMethodId, amount, currency } = processPaymentDto;
    const amountInCents = Math.round(amount * 100);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        payment_method: paymentMethodId,
        confirm: true
      });
      return paymentIntent;
    } catch (error) {
      throw new Error("Error al procesar el pago con tarjeta con Stripe");
    }
  }

  // async getAllTransactions(
  //   page: number = 1,
  //   limit: number = 10
  // ): Promise<{ orders: TransactionInfo[]; total: number }> {
  //   const allCharges = await this.getAllCharges();

  //   const total = allCharges.length;
  //   const offset = (page - 1) * limit;
  //   const paginatedCharges = allCharges.slice(offset, offset + limit);

  //   return {
  //     orders: paginatedCharges.map((charge) =>
  //       this.buildFormatTransaction(charge)
  //     ),
  //     total
  //   };
  // }
  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    date?: string,
    amount?: number
  ): Promise<{ orders: TransactionInfo[]; total: number }> {
    const allCharges = await this.getAllCharges();

    // Aplicar filtros
    const filteredCharges = allCharges.filter((charge) => {
      const chargeDate = new Date(charge.created * 1000)
        .toISOString()
        .split("T")[0];
      const amountInPesos = charge.amount / 100000;

      const matchesDate = date ? new RegExp(date).test(chargeDate) : true;
      const matchesAmount = amount
        ? amountInPesos.toFixed(1).startsWith(amount.toFixed(1))
        : true;

      return matchesDate && matchesAmount;
    });

    const total = filteredCharges.length;
    const offset = (page - 1) * limit;
    const paginatedCharges = filteredCharges.slice(offset, offset + limit);

    return {
      orders: paginatedCharges.map((charge) =>
        this.buildFormatTransaction(charge)
      ),
      total
    };
  }

  private async getAllCharges(): Promise<Stripe.Charge[]> {
    let hasMore = true;
    let lastChargeId = null;
    const allCharges = [];

    while (hasMore) {
      const charges = await this.stripe.charges.list({
        limit: 100,
        starting_after: lastChargeId || undefined
      });

      allCharges.push(...charges.data);
      hasMore = charges.has_more;
      lastChargeId =
        charges.data.length > 0
          ? charges.data[charges.data.length - 1].id
          : null;
    }

    return allCharges;
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private buildFormatTransaction(dataCharge: Stripe.Charge): TransactionInfo {
    const amountInPesos = dataCharge.amount / 100000;
    return {
      id: dataCharge.id,
      amount: amountInPesos,
      currency: dataCharge.currency,
      status: dataCharge.status,
      created: this.formatTimestamp(dataCharge.created),
      card_brand: dataCharge.payment_method_details.card.brand
    };
  }
}
