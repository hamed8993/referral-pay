import { Request } from 'express';

export type GetMulterConfigType = {
  uniqueFileName?: string | ((arg: Request) => string);
  destAfterBase: string | ((arg: Request) => string);
  fileTypes?: RegExp;
  maxSizeMB?: number;
};
