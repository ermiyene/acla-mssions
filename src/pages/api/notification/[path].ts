import { NotificationController } from "@/lib/server/controllers/notification.controller";
import {
  SendEmailVerificationCodeDto,
  SendPhoneVerificationCodeDto,
  SendPledgeLinkDto,
  VerifyCodeDto,
} from "@/lib/server/dtos/notification.dto";
import { routeMatch } from "@/lib/server/helpers/route-match";
import { validate } from "@/lib/server/helpers/validator";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function NotificationRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rateLimitOptions = {
    limit: 1000,
    duration: 60,
    key: "notification",
  };

  return await routeMatch(
    req,
    res,
    rateLimitOptions
  )([
    {
      path: "/api/notification/send-phone-verification-code",
      method: "POST",
      controller: NotificationController.sendPhoneVerificationCode,
      validator: validate(SendPhoneVerificationCodeDto, "body"),
    },
    {
      path: "/api/notification/send-email-verification-code",
      method: "POST",
      controller: NotificationController.sendEmailVerificationCode,
      validator: validate(SendEmailVerificationCodeDto, "body"),
    },
    {
      path: "/api/notification/verify-phone",
      method: "POST",
      controller: NotificationController.verifyPhone,
      validator: validate(VerifyCodeDto, "body"),
    },
    {
      path: "/api/notification/verify-email",
      method: "POST",
      controller: NotificationController.verifyEmail,
      validator: validate(VerifyCodeDto, "body"),
    },
    {
      path: "/api/notification/pledge-link",
      method: "POST",
      controller: NotificationController.sendPledgeLink,
      validator: validate(SendPledgeLinkDto, "body"),
    },
    {
      path: "/api/notification/thank-you",
      method: "POST",
      controller: NotificationController.sendThankYouForContribution,
      validator: validate(SendPledgeLinkDto, "body"),
    },
    {
      path: "/api/notification/job",
      method: "GET",
      controller: NotificationController.sendRemindersForConfirmation,
    },
  ]);
}
