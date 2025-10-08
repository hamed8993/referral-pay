import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepositAddress } from "./entity/deposit-address.entity";

@Module({
    imports:[TypeOrmModule.forFeature([DepositAddress])]
})
export class DepositeAddress {}