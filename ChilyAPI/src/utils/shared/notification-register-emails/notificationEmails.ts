// notification-emails.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env.development" });

@Injectable()
export class NotificationEmailsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NOTIFICATIONS_EMAIL_USER,
        pass: process.env.NOTIFICATIONS_EMAIL_PASS,
      },
    });
  }

  async sendRegistrationEmail(email: string, username: string) {
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Registro exitoso",
      text: `Hola ${username}, ¡te has registrado exitosamente en Chily!`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw new InternalServerErrorException(
        "Error al enviar el correo electrónico",
      );
    }
  }
}
