import { CommonApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

export class UploadDepositDocDto
  extends CommonApiResponseDto
  implements IControllerResponse<{ depositDocUrl: string }>
{
  data: { depositDocUrl: string };
}
