import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "../services/auth.service";
import { CreateUserDto, LoginDto } from "../dtos/auth.dto";
import { NextApiRequestWithUser } from "../helpers/route-match";
import * as cookie from "cookie";
import { parseError } from "@/lib/common/utils/error";
export class AuthController {
  public static async createUser(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as CreateUserDto;
    if (
      body.role === "ADMIN" &&
      body.registrationCode !== process.env.ADMIN_REGISTRATION_CODE
    ) {
      return res.status(403).json({ message: "Invalid registration code" });
    }

    try {
      const user = await AuthService.createUser(body);
      return res.status(201).json(user);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error registering user",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async login(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as LoginDto;

    try {
      const result = await AuthService.login(body);
      const accessTokenCookie = cookie.serialize(
        "accessToken",
        result.accessToken,
        {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        }
      );
      res.setHeader("Set-Cookie", accessTokenCookie);
      return res.status(200).json({ user: result.user });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error logging in",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async getCurrentUser(
    req: NextApiRequestWithUser,
    res: NextApiResponse
  ) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(req.user);
  }

  public static async logout(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
    );
    return res.status(200).json({ message: "Logged out" });
  }
}
