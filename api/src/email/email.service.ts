import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import smtpConfig from 'src/config/smtp.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(smtpConfig.KEY)
    smtpConfiguration: ConfigType<typeof smtpConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: smtpConfiguration.host, // MailHog host
      port: smtpConfiguration.port, // MailHog SMTP port
      secure: smtpConfiguration.secure, // MailHog doesn't use TLS/SSL
    });
  }

  /**
   * Sends an email using MailHog via SMTP.
   * @param to - The destination email address.
   * @param subject - The email subject.
   * @param body - The email body (HTML or plain text).
   */
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: '"EasyMotion" <noreply@easymotion.dev>',
      to,
      subject,
      text: body,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
