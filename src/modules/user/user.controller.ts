import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FullRegisterDto } from './dto/requests/full-register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { Request as ExpressRequest } from 'express';
import { getMulterConfig } from '../multer/helper/get-multer.config';
import { UpdateUserDto } from './dto/requests/update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { FullRegisterResDto } from './dto/responses/full-register.dto';
import { UpoadProfileDto } from './dto/requests/upload-profile.dto';
import { UploadProfileResponseDto } from './dto/responses/upload-profile.response.dto';
import { securitySchemeName } from 'swagger.config';

@ApiBearerAuth(securitySchemeName)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    type: FullRegisterResDto,
  })
  @Post('full-register')
  async fullRegister(
    @Body() body: FullRegisterDto,
    @Request() req,
  ): Promise<FullRegisterResDto> {
    const res = await this.userService.fullRegister(body, req.user);
    console.log('res>>>>>', res);
    //res>>>>> UpdateResult { generatedMaps: [], raw: [], affected: 1 }
    return {
      data: {
        enrollment: res.enrollment,
        fullName: res.fullName,
      },
    };
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpoadProfileDto,
  })
  @ApiResponse({ type: UploadProfileResponseDto })
  async uploadProfileImg(
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
    @Body() body: UpdateUserDto,
  ): Promise<UploadProfileResponseDto> {
    const res = await this.userService.updateUser({
      user: req.user,
      payload: {
        ...body,
        profileImgUrl: image?.destination,
      },
    });
    return {
      data: {
        fullName: res.fullName,
        imageAddress: res.profileImgUrl,
      },
    };
  }
}
