import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { ProcessPaymentDto } from "./processPayment.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DocumentationApiTagsModule } from "src/docs";

@Controller("payments")
@ApiTags("Rutas para: Pagos con tarjeta")
@DocumentationApiTagsModule.clasification("Rutas para: Pagos con tarjeta")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("process-payment")
  @ApiOperation({ summary: "Procesar pago con tarjeta" })
  @ApiResponse({ status: 200, description: "Pago procesado exitosamente" })
  @ApiResponse({ status: 400, description: "Error al procesar el pago" })
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      const paymentIntent =
        await this.paymentsService.processPayment(processPaymentDto);
      return { paymentIntent };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
