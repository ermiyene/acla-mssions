import { prismaClient } from "../../../../prisma/client";
import { CreateUserDto, AuthUser, LoginDto } from "../dtos/auth.dto";
import bcrypt from "bcryptjs";
import { signJWT } from "../helpers/jwt";
import { createErrorResponse } from "@/lib/common/utils/error";

export class AuthService {
  private static users = prismaClient.user;

  public static async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.users.create({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
  }

  public static async login(data: LoginDto) {
    const user = await this.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw createErrorResponse({
        status: 404,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw createErrorResponse({
        status: 401,
        message: "Invalid password",
      });
    }

    const sanitizedUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signJWT(sanitizedUser);

    return { user: sanitizedUser, accessToken };
  }
}
