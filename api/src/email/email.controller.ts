import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async sendEmail(): Promise<void> {
    await this.emailService.sendEmail(
      'test@easymotion.devlocal',
      'Subject',
      'Test email',
    );
  }
}
