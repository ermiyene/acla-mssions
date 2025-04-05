import { AdminPledgeController } from "@/lib/server/controllers/admin-pledge.controller";
import { routeMatch } from "@/lib/server/helpers/route-match";
import { USER_ROLE } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function AdminPledgeRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rateLimitOptions = {
    limit: 10000,
    duration: 60,
    key: "admin-pledge",
  };

  return await routeMatch(
    req,
    res,
    rateLimitOptions
  )([
    {
      path: "/api/admin/pledge",
      method: "GET",
      controller: AdminPledgeController.getPledges,
      allowedRoles: [USER_ROLE.ADMIN],
      authorization: true,
    },
  ]);
}
