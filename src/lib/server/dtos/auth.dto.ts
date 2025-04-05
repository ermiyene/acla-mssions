import { USER_ROLE } from "@prisma/client";
import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  @IsEnum(USER_ROLE)
  role!: USER_ROLE;

  @IsString()
  registrationCode!: string;
}

export class LoginDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

export class AuthUser {
  id!: number;

  name!: string;

  email!: string;

  role!: USER_ROLE;
}
