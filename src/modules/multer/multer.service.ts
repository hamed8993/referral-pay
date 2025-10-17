import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage, FileFilterCallback, Options } from 'multer';
import { Request } from 'express';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';

//USELESS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

@Injectable()
export class MulterService {
  constructor(private configService: ConfigService) {}
  async multerConfig(options: {
    unqueFileName?: string;
    destAfterBase: string;
    fileTypes?: RegExp;
    maxSizeMB?: number;
  }): Promise<Options> {
    return {
      limits: {
        fileSize: options.maxSizeMB
          ? options.maxSizeMB * 1024 * 1024
          : undefined,
      },
      fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
      ) => {
        if (options.fileTypes) {
          return cb(null, options.fileTypes.test(file.mimetype));
        } else {
          return cb(null, true);
        }
      },

      storage: diskStorage({
        destination: (_req, file, cb) => {
          const basePath = path.join(
            process.cwd(),
            this.configService.get('MULTER_UPLOAD_DEST') || 'uploades',
            options.destAfterBase,
          );

          if (!existsSync(basePath)) {
            mkdirSync(basePath, { recursive: true });
          }
        },

        filename: (_req, file, cb) => {
          const now = new Date();
          let name = options.unqueFileName
            ? options.unqueFileName
            : `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds}`;
          cb(null, `${name}-${path.extname(file.originalname)}`);
        },
      }),
    };
  }
}
