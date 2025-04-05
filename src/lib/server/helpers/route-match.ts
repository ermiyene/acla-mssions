import { NextApiRequest, NextApiResponse } from "next";
import { AuthUser } from "../dtos/auth.dto";
import * as cookie from "cookie";
export interface NextApiRequestWithUser extends NextApiRequest {
  user: AuthUser;
}
import { verifyJWT } from "./jwt";
import { validate } from "./validator";
import { USER_ROLE } from "@prisma/client";
import { rateLimit as rateLimitFn } from "@/lib/server/helpers/rate-limiter";

type Route =
  | {
      path: string;
      method: string;
      authorization?: never;
      allowedRoles?: never;
      controller: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
      validator?: ReturnType<typeof validate>;
      rateLimit?:
        | boolean
        | {
            limit?: number;
            duration?: number;
            key?: string;
          };
    }
  | {
      path: string;
      method: string;
      authorization: true;
      allowedRoles?: USER_ROLE[];
      validator?: ReturnType<typeof validate>;
      controller: (
        req: NextApiRequestWithUser,
        res: NextApiResponse
      ) => Promise<void>;
      rateLimit?:
        | boolean
        | {
            limit?: number;
            duration?: number;
            key?: string;
          };
    };

export function routeMatch(
  req: NextApiRequest,
  res: NextApiResponse,
  rateLimit?:
    | true
    | {
        limit?: number;
        duration?: number;
        key?: string;
      }
) {
  return async (routes: Route[]) => {
    const { method, url } = req;

    if (!method || !url) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const route = routes.find((route) => {
      const regex = new RegExp(`^${route.path}?.*$`);
      return method === route.method && regex.test(url);
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (
      route.rateLimit !== false &&
      ((route.rateLimit &&
        rateLimitFn(
          req,
          res,
          typeof route.rateLimit === "boolean" ? undefined : route.rateLimit
        )) ||
        (rateLimit &&
          rateLimitFn(
            req,
            res,
            typeof rateLimit === "boolean" ? undefined : rateLimit
          )))
    ) {
      return;
    }

    if (route.validator) {
      const isValid = await route.validator(req, res);
      if (!isValid) {
        return;
      }
    }

    if (route.authorization) {
      const token = cookie.parse(req.headers.cookie || "")["accessToken"];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decodedUser = (await verifyJWT(token)).user;

      if (
        route.allowedRoles &&
        !route.allowedRoles.includes(decodedUser.role)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const reqWithUser = req as NextApiRequestWithUser;
      reqWithUser.user = decodedUser;
      return await route.controller(reqWithUser, res);
    }

    return await route.controller(req, res);
  };
}
