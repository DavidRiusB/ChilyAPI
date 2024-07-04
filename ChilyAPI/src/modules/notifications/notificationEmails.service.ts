// Vendors
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env.development" });
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

// Templates
import {
  registrationMailTemplate,
  passwordReset,
  DiscountMailTemplate,
  UsedDiscountMailTemplate,
  passwordChangeSuccessTemplate,
} from "./texts";

@Injectable()
export class NotificationEmailsService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NOTIFICATIONS_EMAIL_USER,
        pass: process.env.NOTIFICATIONS_EMAIL_PASS,
      },
    });
  }

  private createTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NOTIFICATIONS_EMAIL_USER,
        pass: process.env.NOTIFICATIONS_EMAIL_PASS,
      },
    });
  }

  private async sendEmail(mailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  }

  async sendRegistrationEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Registro exitoso en Chily",
      html: registrationMailTemplate(username),
    };
    await this.sendEmail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = token;
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Restablecimiento de contraseña",
      html: passwordReset(resetUrl),
    };
    await this.sendEmail(mailOptions);
  }

  async sendDiscountCodeEmail(
    email: string,
    username: string,
    discount: number,
    code: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Código de Descuento en Chily",
      html: DiscountMailTemplate(username, discount, code),
    };
    await this.sendEmail(mailOptions);
  }

  async sendUsedDiscountCodeEmail(
    email: string,
    username: string,
    discount: number,
    code: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Uso de tu Código de Descuento en Chily",
      html: UsedDiscountMailTemplate(username, discount, code),
    };
    await this.sendEmail(mailOptions);
  }

   async sendPasswordChangeSuccessEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: process.env.NOTIFICATIONS_EMAIL_USER,
      to: email,
      subject: "Cambio de contraseña exitoso en Donde Chily",
      html: passwordChangeSuccessTemplate(username),
    };
    await this.sendEmail(mailOptions);
  }

}


