import { NextApiRequest, NextApiResponse } from "next";
import { PledgeService } from "../services/pledge.service";
import { parseError } from "@/lib/common/utils/error";
import { CreateUserDto } from "../dtos/auth.dto";
import {
  AddInKindItemsDto,
  AddTransferMethodDto,
  CreatePledgeDto,
  DeleteTransferMethodDto,
  EditTransferMethodDto,
  GetPledgeDto,
  SaveTransferConfirmationDto,
  UpdatePledgeDto,
} from "../dtos/pledge.dto";

export class PledgeController {
  public static async getTransferMethods(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const transferMethods = await PledgeService.getTransferMethods();
      return res.status(200).json(transferMethods);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error getting transfer methods",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async addTransferMethod(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as AddTransferMethodDto;
      const transferMethod = await PledgeService.addTransferMethod(dto);
      return res.status(201).json(transferMethod);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error adding transfer method",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async editTransferMethod(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as EditTransferMethodDto;
      const transferMethod = await PledgeService.editTransferMethod(dto);
      return res.status(200).json(transferMethod);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error editing transfer method",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async deleteTransferMethod(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as DeleteTransferMethodDto;
      const transferMethod = await PledgeService.deleteTransferMethod(dto);
      return res.status(200).json(transferMethod);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error deleting transfer method",
      });
      return res.status(status).json({
        message,
      });
    }
  }
  public static async createPledgeId(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const pledge = await PledgeService.createPledgeId();
      return res.status(201).json(pledge);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error creating pledge id",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async updatePledgeId(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as UpdatePledgeDto;
      const pledge = await PledgeService.updatePledge(dto);
      return res.status(200).json(pledge);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error updating pledge",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async addInKindItems(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as AddInKindItemsDto;
      const items = await PledgeService.addInKindItems(dto);
      return res.status(201).json(items);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error adding in-kind items",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async getInKindItems(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const items = await PledgeService.getInKindItems();
      return res.status(200).json(items);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error getting in-kind items",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async getPledge(req: NextApiRequest, res: NextApiResponse) {
    try {
      const dto = req.body as GetPledgeDto;
      const pledge = await PledgeService.getPledge(dto);
      return res.status(200).json(pledge);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error getting pledge",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async saveTransferConfirmation(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as SaveTransferConfirmationDto;
      const confirmation = await PledgeService.saveTransferConfirmation(dto);
      return res.status(200).json(confirmation);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error saving transfer confirmation",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async getProgress(req: NextApiRequest, res: NextApiResponse) {
    try {
      const progress = await PledgeService.getProgress();
      return res.status(200).json(progress);
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error calculating progress.",
      });
      return res.status(status).json({
        message,
      });
    }
  }
}

