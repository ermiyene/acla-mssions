import { NextApiRequest, NextApiResponse } from "next";
import { parseError } from "@/lib/common/utils/error";
import {
  SendEmailVerificationCodeDto,
  SendPhoneVerificationCodeDto,
  SendPledgeLinkDto,
  VerifyCodeDto,
} from "../dtos/notification.dto";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  public static async sendPhoneVerificationCode(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as SendPhoneVerificationCodeDto;
      const sentAt = await NotificationService.sendPhoneVerificationCode(dto);
      return res.status(200).json({
        message: "Verification code sent",
        sentAt,
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error sending verification code",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async sendEmailVerificationCode(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as SendEmailVerificationCodeDto;
      const sentAt = await NotificationService.sendEmailVerificationCode(dto);
      return res.status(200).json({
        message: "Verification code sent",
        sentAt,
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error sending verification code",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async verifyPhone(req: NextApiRequest, res: NextApiResponse) {
    try {
      const dto = req.body as VerifyCodeDto;
      const verification = await NotificationService.verifyPhone(dto);
      return res.status(200).json({
        message: "Phone verified",
        verification,
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error verifying phone",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async verifyEmail(req: NextApiRequest, res: NextApiResponse) {
    try {
      const dto = req.body as VerifyCodeDto;
      const verification = await NotificationService.verifyEmail(dto);
      return res.status(200).json({
        message: "Email verified",
        verification,
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error verifying email",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async sendPledgeLink(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as SendPledgeLinkDto;
      await NotificationService.sendPledgeLink(dto);
      return res.status(200).json({
        message: "Message sent",
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error sending message",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async sendThankYouForContribution(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const dto = req.body as SendPledgeLinkDto;
      await NotificationService.sendThankYouForContribution(dto);
      return res.status(200).json({
        message: "Message sent",
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error sending message",
      });
      return res.status(status).json({
        message,
      });
    }
  }

  public static async sendRemindersForConfirmation(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const queueLength =
        await NotificationService.sendRemindersForConfirmation();
      return res.status(200).json({
        message: "Job started",
        queueLength,
      });
    } catch (error) {
      const { status, message } = parseError(error, {
        defaultMessage: "Error starting job.",
      });
      return res.status(status).json({
        message,
      });
    }
  }
}
