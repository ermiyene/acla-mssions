import { createErrorResponse } from "@/lib/common/utils/error";
import { prismaClient } from "../../../../prisma/client";
import {
  AddInKindItemsDto,
  AddTransferMethodDto,
  DeleteTransferMethodDto,
  EditTransferMethodDto,
  GetPledgeDto,
  SaveTransferConfirmationDto,
  UpdateInKindItemsDto,
  UpdatePledgeDto as UpdatePledgeDto,
} from "../dtos/pledge.dto";
import { NOTIFICATION_TYPE, Pledge } from "@prisma/client";
import dayjs from "dayjs";

export class PledgeService {
  private static transferMethods = prismaClient.transferMethod;
  private static pledges = prismaClient.pledge;
  private static monetaryContributions = prismaClient.monetaryContribution;
  private static inKindItem = prismaClient.inKindItem;
  private static inKindContributions = prismaClient.inKindContribution;
  private static inKindItemSelections = prismaClient.inKindItemSelection;
  private static phoneVerifications = prismaClient.phoneVerification;
  private static emailVerifications = prismaClient.emailVerification;
  private static transferConfirmations = prismaClient.transferConfirmation;
  private static target = prismaClient.target;

  public static async getTransferMethods() {
    return await this.transferMethods.findMany({
      select: {
        id: true,
        name: true,
        accountNumber: true,
        currency: true,
        accountHolderName: true,
        swiftCode: true,
      },
      where: {
        deletedAt: null,
      },
    });
  }

  public static async addTransferMethod(dto: AddTransferMethodDto) {
    try {
      return await this.transferMethods.create({
        data: {
          name: dto.name,
          accountNumber: dto.accountNumber,
          currency: dto.currency,
          accountHolderName: dto.accountHolderName,
          swiftCode: dto.swiftCode,
        },
      });
    } catch (error) {
      console.error(error);
      throw createErrorResponse({
        status: 400,
        message: "Error adding transfer method",
      });
    }
  }

  public static async deleteTransferMethod(dto: DeleteTransferMethodDto) {
    try {
      await this.transferMethods.update({
        where: {
          id: dto.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(error);
      throw createErrorResponse({
        status: 400,
        message: "Error deleting transfer method",
      });
    }
  }

  public static async editTransferMethod(dto: EditTransferMethodDto) {
    try {
      return await this.transferMethods.update({
        where: {
          id: dto.id,
        },
        data: {
          name: dto.name,
          accountNumber: dto.accountNumber,
          currency: dto.currency,
          accountHolderName: dto.accountHolderName,
          swiftCode: dto.swiftCode,
        },
      });
    } catch (error) {
      console.error(error);
      throw createErrorResponse({
        status: 400,
        message: "Error editing transfer method",
      });
    }
  }

  public static async getTransferMethodById(id: string) {
    if (!id) {
      throw createErrorResponse({
        status: 404,
        message: "Transfer method not found",
      });
    }

    const transferMethod = await this.transferMethods.findUnique({
      where: {
        id,
      },
    });

    if (!transferMethod) {
      throw createErrorResponse({
        status: 404,
        message: "Transfer method not found",
      });
    }

    return transferMethod;
  }

  private static async generateUniqueId(length = 9): Promise<string> {
    // Generate a UUID
    const uuid = crypto.randomUUID();

    // Create a hash using the UUID
    const hashBuffer = new TextEncoder().encode(uuid); // Encode the UUID
    const hash = await crypto.subtle.digest("SHA-256", hashBuffer); // SHA-256 hash

    // Convert hash to alphanumeric string and shorten it
    const hashArray = Array.from(new Uint8Array(hash)); // Convert buffer to byte array
    const base64 = btoa(String.fromCharCode(...hashArray)); // Convert to Base64
    const alphanumeric = base64.replace(/[^0-9]/g, ""); // Remove non-numeric chars

    // const hyphenated = alphanumeric.replace(/(.{3})/g, "$1 "); // Add spaces every 3 characters

    if (alphanumeric?.length < length - 1) {
      return await this.generateUniqueId(length);
    }

    // return hyphenated.slice(0, length + 2); // Return the first `length` characters
    return "P" + alphanumeric.slice(0, length - 1); // Return the first `length` characters
  }

  public static async createPledgeId(): Promise<Pledge> {
    const uniqueId = await this.generateUniqueId();

    const exists = await this.pledges.findUnique({
      where: {
        id: uniqueId,
      },
    });

    if (exists) {
      console.warn(
        `Duplicate pledge ID generated. ID: ${uniqueId}. Retrying...`
      );
      return await this.createPledgeId(); // Recursively call the function until a unique ID is generated
    }

    return await this.pledges.create({
      data: { id: uniqueId },
    });
  }

  public static async updatePledge(dto: UpdatePledgeDto) {
    const exists = await this.pledges.findUnique({
      where: {
        id: dto.pledgeId,
      },
    });

    if (!exists) {
      throw createErrorResponse({
        status: 404,
        message: "Pledge doesn't exist",
      });
    }

    if (dto?.pledgeAmount) {
      if (dto?.pledgeAmount < 1 || dto?.pledgeAmount > 5 * Math.pow(10, 6)) {
        throw createErrorResponse({
          status: 400,
          message: "Invalid pledge amount",
        });
      }

      const transferConfirmationExists =
        await this.transferConfirmations.findFirst({
          where: {
            monetaryContribution: {
              pledgeId: dto.pledgeId,
            },
            deletedAt: null,
          },
        });

      if (transferConfirmationExists) {
        throw createErrorResponse({
          status: 400,
          message: "Pledge already confirmed",
        });
      }

      await this.monetaryContributions.upsert({
        where: {
          pledgeId: dto.pledgeId,
        },
        update: {
          amount: dto.pledgeAmount,
          pledgeId: dto.pledgeId,
          currency: dto.currency,
          transferMethodId: dto.transferMethod,
        },
        create: {
          amount: dto.pledgeAmount,
          pledgeId: dto.pledgeId,
          currency: dto.currency,
          transferMethodId: dto.transferMethod,
        },
      });
    }

    if (dto?.items?.length) {
      if (dto?.items?.some((i) => i?.amount < 1)) {
        throw createErrorResponse({
          status: 400,
          message: "Invalid item amount",
        });
      }

      let contributions = await this.inKindContributions.findUnique({
        where: {
          pledgeId: dto?.pledgeId,
        },
        include: {
          inKindItemSelections: true,
        },
      });

      if (!contributions) {
        contributions = await this.inKindContributions.create({
          data: {
            pledgeId: dto.pledgeId,
          },
          include: {
            inKindItemSelections: true,
          },
        });
      }

      const inKindItemSelections = contributions?.inKindItemSelections || [];

      const itemsToUpdate = inKindItemSelections
        ?.filter((c) => dto?.items?.some((i) => c?.id === i?.id))
        ?.map((c) => ({
          id: c.id,
          amount: dto?.items?.find((i) => c.id === i.id)?.amount,
        }));
      const itemsToRemove = inKindItemSelections?.filter(
        (c) => !dto?.items?.some((i) => c?.id === i?.id)
      );
      const itemsToAdd = dto?.items?.filter(
        (i) => !inKindItemSelections?.some((c) => c?.id === i?.id)
      );

      for (const item of itemsToUpdate) {
        await this.inKindItemSelections.update({
          where: {
            id: item.id,
          },
          data: {
            amount: item.amount,
          },
        });
      }

      for (const item of itemsToRemove) {
        await this.inKindItemSelections.delete({
          where: {
            id: item.id,
          },
        });
      }

      for (const item of itemsToAdd) {
        await this.inKindItemSelections.create({
          data: {
            inKindItemId: item.id,
            amount: item.amount,
            inKindContributionId: contributions.id,
          },
        });
      }
    }

    if (exists.phone && dto.phone !== exists.phone) {
      this.phoneVerifications.updateMany({
        where: {
          pledgeId: dto.pledgeId,
          phone: exists.phone,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    if (exists.email && dto.email !== exists.email) {
      this.emailVerifications.updateMany({
        where: {
          pledgeId: dto.pledgeId,
          email: exists.email,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    const pledges = await this.pledges.update({
      where: {
        id: dto.pledgeId,
      },
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
      },
      include: {
        phoneVerifications: {
          where: {
            deletedAt: null,
          },
        },
        emailVerifications: {
          where: {
            deletedAt: null,
          },
        },
        monetaryContribution: true,
        inKindContribution: true,
      },
    });

    dto?.items?.length &&
      this.recalculateQuantityForInKindItems({
        items: dto?.items,
      }); // intentionally not awaiting

    return pledges;
  }

  public static async addInKindItems(dto: AddInKindItemsDto) {
    const items = dto.items.map((item) => ({
      name: item.name,
      unit: item.unit,
      category: item.category,
      parentCategory: item.parentCategory,
    }));

    return await this.inKindItem.createMany({
      data: items,
    });
  }

  private static async recalculateQuantityForInKindItems(
    dto: UpdateInKindItemsDto
  ) {
    const itemsToUpdate = await this.inKindItem.findMany({
      where: {
        id: {
          in: dto.items.map((i) => i.id),
        },
      },
      include: {
        inKindItemSelections: true,
      },
    });

    const updatedItems = itemsToUpdate.map((item) => {
      const newQuantity =
        item?.inKindItemSelections?.reduce((acc, curr) => {
          return acc + curr.amount;
        }, 0) || 0;

      return {
        id: item.id,
        currentQuantity: newQuantity,
      };
    });

    await this.inKindItem.updateMany({
      data: updatedItems,
      where: {
        id: {
          in: updatedItems.map((i) => i.id),
        },
      },
    });
  }

  public static async getInKindItems() {
    return await this.inKindItem.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
        category: true,
        parentCategory: true,
        currentQuantity: true,
        maxQuantity: true,
      },
      where: {
        isHidden: false,
        deletedAt: null,
      },
    });
  }

  public static async getPledge(dto: GetPledgeDto) {
    return await this.pledges.findUnique({
      where: {
        id: dto.pledgeId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        phoneVerifications: {
          select: {
            verificationDate: true,
          },
        },
        emailVerifications: {
          select: {
            verificationDate: true,
          },
        },
        monetaryContribution: {
          select: {
            amount: true,
            transferMethodId: true,
            currency: true,
            transferConfirmations: {
              where: {
                deletedAt: null,
              },
              select: {
                screenShotUrl: true,
                screenShotKey: true,
              },
            },
          },
        },
        inKindContribution: {
          select: {
            inKindItemSelections: {
              select: {
                amount: true,
                inKindItemId: true,
                handOverDate: true,
              },
            },
          },
        },
      },
    });
  }

  public static async saveTransferConfirmation(
    dto: SaveTransferConfirmationDto
  ) {
    const monetaryContribution = await this.monetaryContributions.findFirst({
      where: {
        pledgeId: dto.pledgeId,
      },
      include: {
        transferConfirmations: true,
      },
    });

    if (!monetaryContribution) {
      throw createErrorResponse({
        status: 404,
        message: "Pledge not found",
      });
    }

    if (monetaryContribution.transferConfirmations.length) {
      throw createErrorResponse({
        status: 400,
        message: "Transfer already confirmed",
      });
    }

    return await this.transferConfirmations.create({
      data: {
        screenShotUrl: dto.screenShotUrl,
        screenShotKey: dto.screenShotKey,
        screenShotRaw: dto.screenShotRaw,
        monetaryContributionId: monetaryContribution.id,
      },
      select: {
        screenShotUrl: true,
        screenShotKey: true,
      },
    });
  }

  public static async getUnconfirmedPledges() {
    const pledges = await this.pledges.findMany({
      where: {
        OR: [
          {
            monetaryContribution: {
              transferConfirmations: {
                none: {},
              },
            },
          },
          {
            inKindContribution: {
              inKindItemSelections: {
                some: {
                  handOverDate: null,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        monetaryContribution: true,
        inKindContribution: true,
        notifications: true,
        phoneVerifications: true,
        emailVerifications: true,
      },
    });

    return pledges?.filter(
      (p) =>
        !p?.notifications ||
        !p?.notifications?.some(
          (n) =>
            n?.type === NOTIFICATION_TYPE.REMIND_TO_CONFIRM_TRANSFER &&
            dayjs().diff(dayjs(n?.sentAt), "days") < 3
        )
    );
  }

  public static async getProgress() {
    const target = await this.target.findFirst({
      select: {
        amount: true,
      },
    });

    const verifiedPledges = await this.pledges.findMany({
      where: {
        monetaryContribution: {
          transferConfirmations: {
            some: {
              adminConfirmationDate: {
                not: null,
              },
            },
          },
        },
      },
      select: {
        monetaryContribution: true,
      },
    });

    const collected = verifiedPledges?.reduce((acc, prev) => {
      return acc + (prev.monetaryContribution?.amount || 0);
    }, 0);

    return {
      progress: (collected / (target?.amount || 1)) * 100,
    };
  }
}
