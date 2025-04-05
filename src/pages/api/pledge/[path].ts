import { PledgeController } from "@/lib/server/controllers/pledge.controller";
import {
  AddTransferMethodDto,
  CreatePledgeDto,
  DeleteTransferMethodDto,
  EditTransferMethodDto,
  SaveTransferConfirmationDto,
  UpdatePledgeDto,
} from "@/lib/server/dtos/pledge.dto";
import { routeMatch } from "@/lib/server/helpers/route-match";
import { validate } from "@/lib/server/helpers/validator";
import { USER_ROLE } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function PledgeRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rateLimitOptions = {
    limit: 1000,
    duration: 60,
    key: "pledge",
  };

  return await routeMatch(
    req,
    res,
    rateLimitOptions
  )([
    {
      path: "/api/pledge/update",
      method: "PUT",
      controller: PledgeController.updatePledgeId,
      validator: validate(UpdatePledgeDto, "body"),
    },
    {
      path: "/api/pledge/transfer-methods",
      method: "GET",
      controller: PledgeController.getTransferMethods,
      rateLimit: false,
    },
    {
      path: "/api/pledge/transfer-methods",
      method: "POST",
      controller: PledgeController.addTransferMethod,
      validator: validate(AddTransferMethodDto, "body"),
      authorization: true,
      allowedRoles: [USER_ROLE.ADMIN],
    },
    {
      path: "/api/pledge/transfer-methods",
      method: "PUT",
      controller: PledgeController.editTransferMethod,
      validator: validate(EditTransferMethodDto, "body"),
      authorization: true,
      allowedRoles: [USER_ROLE.ADMIN],
    },
    {
      path: "/api/pledge/transfer-methods",
      method: "DELETE",
      controller: PledgeController.deleteTransferMethod,
      validator: validate(DeleteTransferMethodDto, "body"),
      authorization: true,
      allowedRoles: [USER_ROLE.ADMIN],
    },
    {
      path: "/api/pledge/id",
      method: "POST",
      controller: PledgeController.createPledgeId,
      validator: validate(CreatePledgeDto, "body"),
    },
    {
      path: "/api/pledge/items",
      method: "GET",
      controller: PledgeController.getInKindItems,
    },
    {
      path: "/api/pledge/get",
      method: "POST",
      controller: PledgeController.getPledge,
    },
    {
      path: "/api/pledge/transfer-confirmation",
      method: "POST",
      controller: PledgeController.saveTransferConfirmation,
      validator: validate(SaveTransferConfirmationDto, "body"),
    },
    {
      path: "/api/pledge/progress",
      method: "GET",
      controller: PledgeController.getProgress,
    },
    // {
    //   path: "/api/pledge/add-items",
    //   method: "POST",
    //   controller: PledgeController.addInKindItems,
    //   validator: validate(AddInKindItemsDto, "body"),
    // },
  ]);
}
