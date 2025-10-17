import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterService } from './multer.service';

@Global()
@Module({
  providers: [MulterService],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('MulterModule configuring...');
        return {
          storage: diskStorage({
            destination: configService.getOrThrow('MULTER_UPLOAD_DEST'),
            filename: (req, file, cb) => {
              cb(null, `${Date.now()}-${file.originalname}`);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MulterModule, MulterService],
})
export class UploadModule {}
