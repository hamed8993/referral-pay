import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT as string),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"hamed Financial System"`, // نام سیستم شما
          replyTo: 'hamed7087@gmail.com', // ایمیل پشتیبانی
          headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
          },
        },
        template: {
          // dir: join(__dirname, 'templates'), // مسیر template
          dir: join(process.cwd(), 'src', 'mailer', 'templates'),
          adapter: new HandlebarsAdapter({
            inc: (index) => index + 1,
          }),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
