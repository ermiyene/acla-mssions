import { NextApiRequest, NextApiResponse } from "next";
import { parseError } from "@/lib/common/utils/error";
import { AdminPledgeService } from "../services/admin-pledge.service";

export class AdminPledgeController {
  public static async getPledges(req: NextApiRequest, res: NextApiResponse) {
    try {
      const pledges = await AdminPledgeService.getPledges();
      return res.status(200).json(pledges);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error getting pledges",
      });
      return res.status(status).json({
        message,
      });
    }
  }
}
