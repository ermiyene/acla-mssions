import axios from "axios";
import {
  SendEmailDto,
  SendEmailVerificationCodeDto,
  SendPhoneVerificationCodeDto,
  SendPledgeLinkDto,
  SendSMSDto,
  VerifyCodeDto,
} from "../dtos/notification.dto";
import { prismaClient } from "../../../../prisma/client";
import { createErrorResponse } from "@/lib/common/utils/error";
import { PledgeService } from "./pledge.service";
import { NOTIFICATION_TYPE } from "@prisma/client";
import dayjs from "dayjs";

export class NotificationService {
  private static phoneVerification = prismaClient.phoneVerification;
  private static emailVerification = prismaClient.emailVerification;
  private static notifications = prismaClient.notification;

  private static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // New helper function to wrap a message in a professional HTML template
  private static getHtmlTemplate(message: string) {
    return `
<html>
  <head>
    <meta charset="UTF-8">
    <title>Email Notification</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
      .container { background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 400px }
      h2 { color: #333333; }
      p { color: #555555; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="container">
      ${message}
    </div>
  </body>
</html>
    `;
  }

  // New helper function to strip HTML tags from the message for plain-text emails
  private static stripHtmlTags(message: string) {
    return message.replace(/<\/?[^>]+(>|$)/g, "");
  }

  public static async sendSMS(dto: SendSMSDto) {
    const notification = await this.notifications.create({
      data: {
        pledgeId: dto.pledgeId,
        message: dto.message,
        type: dto.type,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log({
        to: dto.phoneNumber,
        message: dto.message,
      });
    } else {
      await axios.post(
        `${process.env.AFRO_MESSAGE_URL}/send`,
        {
          // sender: process.env.AFRO_MESSAGE_SENDER_NAME,
          to: dto.phoneNumber,
          message: dto.message,
          callback: process.env.AFRO_MESSAGE_CALLBACK_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AFRO_MESSAGE_API_KEY}`,
            "Content-type": "application/json",
          },
        }
      );
    }

    return await this.notifications.update({
      where: {
        id: notification?.id,
      },
      data: {
        sentAt: new Date(),
      },
    });
  }

  public static async sendEmail(dto: SendEmailDto) {
    const notification = await this.notifications.create({
      data: {
        pledgeId: dto.pledgeId,
        message: dto.message,
        type: dto.type,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log({
        to: dto.email,
        message: dto.message,
      });
    } else {
      await axios.post(
        `${process.env.MAIL_SENDER_URL}/email`,
        {
          from: {
            email: process.env.MAIL_SENDER_EMAIL,
            name: "EQUIP | ACLA Building Project",
          },
          to: [
            {
              email: dto.email,
              name: dto.name,
            },
          ],
          subject: dto.subject,
          text: this.stripHtmlTags(dto.message),
          html: this.getHtmlTemplate(dto.message),
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MAIL_SENDER_API_KEY}`,
            "Content-type": "application/json",
          },
        }
      );
    }

    return await this.notifications.update({
      where: {
        id: notification?.id,
      },
      data: {
        sentAt: new Date(),
      },
    });
  }

  public static async sendBulkSMS(dto: SendSMSDto[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(dto);
    } else {
      await axios.post(
        `${process.env.AFRO_MESSAGE_URL}/bulk_send`,
        {
          to: dto.map((d) => ({
            to: d.phoneNumber,
            message: d.message,
          })),
          callback: process.env.AFRO_MESSAGE_CALLBACK_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AFRO_MESSAGE_API_KEY}`,
            "Content-type": "application/json",
          },
        }
      );
    }

    return await this.notifications.createMany({
      data: dto?.map((d) => ({
        pledgeId: d.pledgeId,
        message: d.message,
        type: d.type,
        sentAt: new Date(),
      })),
    });
  }

  public static async sendBulkEmail(dto: SendEmailDto[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(dto);
    } else {
      await axios.post(
        `${process.env.AFRO_MESSAGE_URL}/bulk_send`,
        dto.map((d) => ({
          from: {
            email: "info@trial-zr6ke4ndx3egon12.mlsender.net",
            name: "EQUIP | ACLA Building Project",
          },
          to: [
            {
              email: d.email,
              name: d.name,
            },
          ],
          subject: d.subject,
          text: this.stripHtmlTags(d.message),
          html: this.getHtmlTemplate(d.message),
        })),
        {
          headers: {
            Authorization: `Bearer ${process.env.MAIL_SENDER_API_KEY}`,
            "Content-type": "application/json",
          },
        }
      );
    }

    return await this.notifications.createMany({
      data: dto?.map((d) => ({
        pledgeId: d.pledgeId,
        message: d.message,
        type: d.type,
        sentAt: new Date(),
      })),
    });
  }

  public static async sendPhoneVerificationCode(
    dto: SendPhoneVerificationCodeDto
  ) {
    const verification = await this.phoneVerification.create({
      data: {
        pledgeId: dto.pledgeId,
        phone: dto.phone,
        code: this.generateCode(),
      },
    });

    await this.sendSMS({
      phoneNumber: dto.phone,
      message: `Your verification code for your pledge with Pledge ID (${dto.pledgeId}) for the EQUIP | ACLA Building Project is ${verification?.code}. Please verify it at ${process.env.NEXT_PUBLIC_APP_BASE_URL}/?pledgeId=${dto.pledgeId}&step=verify&code=${verification.code}.`,
      type: NOTIFICATION_TYPE.PHONE_VERIFICATION,
      pledgeId: dto.pledgeId,
    });

    return verification?.createdAt;
  }

  public static async sendEmailVerificationCode(
    dto: SendEmailVerificationCodeDto
  ) {
    const verification = await this.emailVerification.create({
      data: {
        pledgeId: dto.pledgeId,
        email: dto.email,
        code: this.generateCode(),
      },
    });

    await this.sendEmail({
      email: dto.email,
      subject: "Please verify your email",
      message: `Your verification code for your pledge with Pledge ID (${dto.pledgeId}) for the EQUIP | ACLA Building Project is ${verification?.code}. Please verify it at ${process.env.NEXT_PUBLIC_APP_BASE_URL}/?pledgeId=${dto.pledgeId}&step=verify&code=${verification.code}.`,
      type: NOTIFICATION_TYPE.PHONE_VERIFICATION,
      pledgeId: dto.pledgeId,
    });

    return verification?.createdAt;
  }

  public static async verifyPhone(dto: VerifyCodeDto) {
    const verification = await this.phoneVerification.findFirst({
      where: {
        pledgeId: dto.pledgeId,
        code: String(dto.code),
        deletedAt: null,
        createdAt: {
          gte: dayjs().subtract(15, "minutes").toDate(), // Must be verified within 15 minutes
        },
      },
    });

    if (!verification) {
      throw createErrorResponse({
        status: 400,
        message: "Phone verification failed",
      });
    }

    await this.phoneVerification.updateMany({
      where: {
        id: { not: verification.id },
        pledgeId: dto.pledgeId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return await this.phoneVerification.update({
      where: {
        id: verification.id,
      },
      data: {
        verificationDate: new Date(),
      },
      select: {
        verificationDate: true,
      },
    });
  }

  public static async verifyEmail(dto: VerifyCodeDto) {
    const verification = await this.emailVerification.findFirst({
      where: {
        pledgeId: dto.pledgeId,
        code: String(dto.code),
        deletedAt: null,
        createdAt: {
          gte: dayjs().subtract(15, "minutes").toDate(), // Must be verified within 15 minutes
        },
      },
    });

    if (!verification) {
      throw createErrorResponse({
        status: 400,
        message: "Email verification failed",
      });
    }

    await this.emailVerification.updateMany({
      where: {
        id: { not: verification.id },
        pledgeId: dto.pledgeId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return await this.emailVerification.update({
      where: {
        id: verification.id,
      },
      data: {
        verificationDate: new Date(),
      },
      select: {
        verificationDate: true,
      },
    });
  }

  public static async sendPledgeLink(dto: SendPledgeLinkDto) {
    const exists = await this.notifications.findFirst({
      where: {
        pledgeId: dto.pledgeId,
        type: NOTIFICATION_TYPE.THANK_YOU_FOR_PLEDGE,
        sentAt: {
          not: null,
        },
      },
    });

    if (exists) {
      return;
    }

    const pledge = await PledgeService.getPledge(dto);
    if (
      !(
        pledge?.phone &&
        pledge?.phoneVerifications?.some((v) => !!v?.verificationDate)
      ) &&
      !(
        pledge?.email &&
        pledge?.emailVerifications?.some((v) => !!v?.verificationDate)
      )
    ) {
      return;
    }

    const messageParts: string[] = [];

    // Intro section
    messageParts.push(
      `Thank you for your pledge to contribute for the EQUIP | ACLA Building Project. Here are the details for your pledge.
    
Pledge ID: ${pledge?.id}
Name: ${pledge?.name || "Anonyms"}
${pledge?.phone ? "Phone: " + pledge?.phone : ""}${
        pledge?.email ? "Email: " + pledge?.email : ""
      }`
    );

    // Monetary section (conditional)
    if (pledge?.monetaryContribution) {
      const transferMethod = await PledgeService.getTransferMethodById(
        pledge?.monetaryContribution.transferMethodId
      );

      messageParts.push(
        `Amount: ${pledge?.monetaryContribution?.amount?.toLocaleString()} Birr
Transfer Method: ${transferMethod?.name}

Please transfer your pledge with these steps:
- Send ${pledge?.monetaryContribution?.amount?.toLocaleString()} Birr to the account ${
          transferMethod?.accountNumber
        } with ${transferMethod?.name}
- Make sure to include your Pledge ID (${pledge?.id}) in the transfer notes
- Click this link to confirm your payment: ${
          process.env.NEXT_PUBLIC_APP_BASE_URL
        }/?pledgeId=${dto.pledgeId}&step=confirm`
      );
    }

    // In-kind section (conditional)
    if (pledge?.inKindContribution) {
      const items = await PledgeService.getInKindItems();
      const itemNames = pledge.inKindContribution?.inKindItemSelections
        ?.map((selection) => {
          const item = items?.find((i) => i.id === selection?.inKindItemId);
          return `${item?.name} (${selection?.amount} ${item?.unit})`;
        })
        ?.join(", ");

      messageParts.push(
        `Your commitments: ${itemNames}

Please contact ${process.env.NEXT_PUBLIC_OFFICE_NUMBER} to arrange the handover of your contributions. We will ask you for your pledge ID (${pledge?.id}) so please make sure to have it at hand until you hand off all of your contributions.`
      );
    }

    const message = messageParts.join("\n\n");

    if (pledge?.phone) {
      await this.sendSMS({
        phoneNumber: pledge.phone,
        message,
        type: NOTIFICATION_TYPE.THANK_YOU_FOR_PLEDGE,
        pledgeId: pledge.id,
      });
    }
    if (pledge?.email) {
      await this.sendEmail({
        email: pledge.email,
        message,
        name: pledge.name ?? undefined,
        subject:
          "Thank you for committing to give to the EQUIP | ACLA Building Project",
        type: NOTIFICATION_TYPE.THANK_YOU_FOR_PLEDGE,
        pledgeId: pledge.id,
      });
    }

    return;
  }

  public static async sendThankYouForContribution(dto: SendPledgeLinkDto) {
    const pledge = await PledgeService.getPledge({ pledgeId: dto.pledgeId });

    let message = `Thank you for your contribution to the EQUIP | ACLA Building Project and placing your fingerprint on this project to equip God's people and advance His kingdom! You can view the progress of the project at ${process.env.NEXT_PUBLIC_APP_BASE_URL}/?pledgeId=${dto.pledgeId}&step=thankyou`;

    if (!pledge?.phone && !pledge?.email) {
      throw createErrorResponse({
        status: 400,
        message: "Phone or Email not found.",
      });
    }

    if (
      pledge?.phone &&
      pledge?.phoneVerifications?.some((v) => !!v?.verificationDate)
    ) {
      await this.sendSMS({
        phoneNumber: pledge?.phone,
        message,
        type: NOTIFICATION_TYPE.THANK_YOU_FOR_CONTRIBUTION,
        pledgeId: pledge?.id,
      });
    } else if (
      pledge?.email &&
      pledge?.emailVerifications?.some((v) => !!v?.verificationDate)
    ) {
      await this.sendEmail({
        email: pledge?.email,
        message,
        name: pledge?.name ?? undefined,
        subject:
          "Thank you for your contribution to the EQUIP | ACLA Building Project!",
        type: NOTIFICATION_TYPE.THANK_YOU_FOR_CONTRIBUTION,
        pledgeId: pledge?.id,
      });
    }

    return;
  }

  public static async sendRemindersForConfirmation() {
    const pledges = await PledgeService.getUnconfirmedPledges();


    const verifiedPledges = pledges.filter((pledge) => {
      return (
        pledge?.emailVerifications?.some((v) => !!v?.verificationDate) ||
        pledge?.phoneVerifications?.some((v) => !!v?.verificationDate)
      );
    });

    const smsMessages = [];
    const emailMessages = [];

    for (const pledge of verifiedPledges) {
      if (!pledge?.phone) {
        continue;
      }
      let message = "";

      if (pledge?.monetaryContribution) {
        message = `Dear ${
          pledge?.name || "contributor"
        }, We wanted to remind you to confirm your transfer by uploading a screenshot or a photo of your transfer. You can upload the screenshot or photo by going to this link: ${
          process.env.NEXT_PUBLIC_APP_BASE_URL
        }/?pledgeId=${
          pledge?.id
        }&step=confirm. This is important for us to properly verify your contribution. Thank you.`;
      }

      if (pledge?.inKindContribution) {
        message =
          (message?.length
            ? message + `\nWe also `
            : `Dear ${pledge?.name || "contributor"}, We `) +
          `wanted to remind you to hand over your pledged items. Please contact ${process.env.NEXT_PUBLIC_OFFICE_NUMBER} to arrange the handover of your contributions. We will ask you for your pledge ID (${pledge?.id}) so please make sure to have it at hand until you hand off all of your contributions. Thank you.`;
      }

      if (pledge?.phone) {
        smsMessages.push({
          phoneNumber: pledge?.phone,
          message,
          type: NOTIFICATION_TYPE.REMIND_TO_CONFIRM_TRANSFER,
          pledgeId: pledge?.id,
        });
      } else if (pledge?.email) {
        emailMessages.push({
          email: pledge?.email,
          message,
          name: pledge?.name ?? undefined,
          subject: "Warm reminder to remind you to confirm your payment.",
          type: NOTIFICATION_TYPE.REMIND_TO_CONFIRM_TRANSFER,
          pledgeId: pledge?.id,
        });
      }
    }

    this.sendBulkSMS(smsMessages); // intentionally not awaiting
    this.sendBulkEmail(emailMessages); // intentionally not awaiting
    return;
  }
}
