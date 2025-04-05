import { AuthController } from "@/lib/server/controllers/auth.controller";
import { CreateUserDto, LoginDto } from "@/lib/server/dtos/auth.dto";
import { routeMatch } from "@/lib/server/helpers/route-match";
import { validate } from "@/lib/server/helpers/validator";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function AuthRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await routeMatch(req, res, {
    limit: 5,
    duration: 60,
    key: "auth",
  })([
    {
      path: "/api/auth/register",
      method: "POST",
      controller: AuthController.createUser,
      validator: validate(CreateUserDto, "body"),
    },
    {
      path: "/api/auth/login",
      method: "POST",
      controller: AuthController.login,
      validator: validate(LoginDto, "body"),
    },
    {
      path: "/api/auth/me",
      method: "GET",
      controller: AuthController.getCurrentUser,
      authorization: true,
      rateLimit: false,
    },
    {
      path: "/api/auth/logout",
      method: "POST",
      controller: AuthController.logout,
      rateLimit: false,
    },
  ]);
}
