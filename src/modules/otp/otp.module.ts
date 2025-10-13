import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "./entity/otp.entity";
import { OtpService } from "./opt.service";

@Module({
imports:[TypeOrmModule.forFeature([Otp])],
providers:[OtpService],
exports:[OtpService]
})
export class OtpModule {}