import { CURRENCY } from "@prisma/client";
import { JsonArray } from "@prisma/client/runtime/library";
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsPhoneNumber,
  IsArray,
  IsJSON,
  IsEnum,
  IsEmail,
  ValidateIf,
} from "class-validator";

export class CreatePledgeDto {
  @IsString()
  @IsOptional()
  pledgeId?: string;
}

export class UpdatePledgeDto {
  @IsString()
  pledgeId: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pledgeAmount: number;

  @IsString()
  @IsOptional()
  transferMethod: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  currency: CURRENCY;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsArray()
  @IsOptional()
  items: {
    id: string;
    amount: number;
  }[];
}

export class AddInKindItemsDto {
  @IsArray()
  items: {
    name: string;
    unit: string;
    category: string;
    parentCategory: string;
  }[];
}

export class UpdateInKindItemsDto {
  @IsArray()
  @IsOptional()
  items: {
    id: string;
    amount: number;
  }[];
}
export class GetPledgeDto {
  @IsString()
  pledgeId: string;
}

export class SaveTransferConfirmationDto {
  @IsString()
  pledgeId: string;

  @IsString()
  screenShotUrl: string;

  @IsString()
  screenShotKey: string;

  @IsJSON()
  screenShotRaw: JsonArray;
}

export class AddTransferMethodDto {
  @IsString()
  name: string;

  @ValidateIf((o) => typeof o.value === "string")
  @IsString()
  @ValidateIf((o) => typeof o.value === "number")
  @IsNumber()
  accountNumber: string;

  @IsEnum(CURRENCY)
  currency: CURRENCY;

  @IsString()
  @IsOptional()
  accountHolderName?: string;

  @ValidateIf((o) => typeof o.value === "string")
  @IsString()
  @ValidateIf((o) => typeof o.value === "number")
  @IsNumber()
  @IsOptional()
  swiftCode?: string;
}

export class EditTransferMethodDto extends AddTransferMethodDto {
  @IsString()
  id: string;
}

export class DeleteTransferMethodDto {
  @IsString()
  id: string;
}
