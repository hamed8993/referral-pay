import { Otp } from "../entity/otp.entity";

export type InavalidateOtResponse = {
  result: boolean;
  updatedOtp: Otp;
};
