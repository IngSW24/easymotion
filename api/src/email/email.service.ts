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
      html: generateEmailTemplate(subject, body),
    };

    await this.transporter.sendMail(mailOptions);
  }
}

const generateEmailTemplate = (subject, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .email-footer {
      background-color: #f4f4f9;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
    .email-footer a {
      color: #007bff;
      text-decoration: none;
    }
    .url-button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      color: white;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    .url-button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <p>${content}</p>
    </div>
    <div class="email-footer">
      <p>© 2025 EasyMotion. All rights reserved.</p>
      <p><a href="https://easymotion.it">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
`;
