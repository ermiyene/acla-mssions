import { prismaClient } from "../../../../prisma/client";

export class AdminPledgeService {
  private static pledges = prismaClient.pledge;


  public static async getPledges() {
    return await this.pledges.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        createdAt: true,
        id: true,
        name: true,
        phone: true,
        email: true,
        emailVerifications: {
          select: {
            verificationDate: true,
          },
        },
        phoneVerifications: {
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
                inKindItem: {
                  select: {
                    name: true,
                    unit: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
