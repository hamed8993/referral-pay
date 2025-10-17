import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IFullRegister } from './interface/full-register.interface';
import { UserService } from './user.service';
import { FullRegisterDto } from './dto/full-register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { Request as ExpressRequest } from 'express';
import { getMulterConfig } from '../multer/helper/get-multer.config';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('fullRegister')
  async fullRegister(
    @Body() body: FullRegisterDto,
    @Request() req,
  ): Promise<any> {
    return this.userService.fullRegister(body, req.user);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor(
      'image',
      getMulterConfig({
        destAfterBase: (req: ExpressRequest) =>
          `profile-images/${(req.user as ValidatedJwtUser).email as string}`,
        uniqueFileName: (req) => (req.user as ValidatedJwtUser).email as string,
        fileTypes: /^image\/(jpg|jpeg|png|gif|bmp|webp)$/i,
      }),
    ),
  )
  async uploadProfileImg(
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
    @Body() body: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser({
      user: req.user,
      payload: {
        ...body,
        profileImgUrl: image?.destination,
      },
    });
  }
}
