import { existsSync, mkdirSync } from 'fs';
import { diskStorage, FileFilterCallback, Options } from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { GetMulterConfigType } from '../types/get-multer-config-arg.type';

export const getMulterConfig: (options: GetMulterConfigType) => Options = (
  options,
) => {
  return {
    limits: {
      fileSize: (options.maxSizeMB || 5) * 1024 * 1024, // default 5MB
    },
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      if (options.fileTypes && !options.fileTypes.test(file.mimetype)) {
        return cb(null, false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, _file, cb) => {
        const basePath = path.join(
          process.cwd(),
          process.env.MULTER_UPLOAD_DEST || './uploads',
          typeof options.destAfterBase === 'function'
            ? options.destAfterBase(req)
            : options.destAfterBase,
        );

        if (!existsSync(basePath)) {
          mkdirSync(basePath, { recursive: true });
        }
        cb(null, basePath);
      },
      filename: (req, file, cb) => {
        const uniqueName =
          typeof options.uniqueFileName === 'function'
            ? options.uniqueFileName(req)
            : options.uniqueFileName
              ? options.uniqueFileName
              : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null, `${uniqueName}${path.extname(file.originalname)}`);
      },
    }),
  };
};
