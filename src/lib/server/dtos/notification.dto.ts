import { NOTIFICATION_TYPE } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class SendSMSDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;

  @IsEnum(NOTIFICATION_TYPE)
  type: NOTIFICATION_TYPE;

  @IsString()
  pledgeId: string;
}

export class SendEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  message: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(NOTIFICATION_TYPE)
  type: NOTIFICATION_TYPE;

  @IsString()
  pledgeId: string;
}

export class SendPhoneVerificationCodeDto {
  @IsString()
  phone: string;

  @IsString()
  pledgeId: string;
}

export class SendEmailVerificationCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  pledgeId: string;
}

export class VerifyCodeDto {
  @IsNumber()
  code: string;

  @IsString()
  pledgeId: string;
}

export class SendPledgeLinkDto {
  @IsString()
  pledgeId: string;
}
