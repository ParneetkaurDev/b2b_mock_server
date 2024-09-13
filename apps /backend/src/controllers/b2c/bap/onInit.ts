import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { responseBuilder } from "../../../lib/utils";

export const onInitController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      context,
      message: {
        order: { provider, provider_location, ...order },
      },
    } = req.body;
    const timestamp = new Date().toISOString();
    const responseMessage = {
      order: {
        ...order,
        tags: [
          ...order.tags,
          {
            descriptor: {
              code: "bap_terms",
            },
            list: [
              {
                descriptor: {
                  code: "accept_bpp_terms",
                },
                value: "Y",
              },
            ],
          },
        ],
        id: uuidv4(),
        state: "Created",
        provider: {
          id: provider.id,
          locations: [
            {
              ...provider_location,
            },
          ],
        },
        fulfillments: order.fulfillments.map(
          ({ id, type, tracking, stops }: any) => ({
            id,
            type,
            tracking,
            stops,
          })
        ),
        payments: [
          {
            ...order.payments[0],
            params: {
              currency: order.quote.price.currency,
              amount: order.quote.price.value,
            },
            status: "NOT-PAID",
            "@ondc/org/settlement_details": [
              {
                settlement_counterparty: "buyer-app",
                settlement_phase: "sale-amount",
                settlement_type: "upi",
                upi_address: "gft@oksbi",
                settlement_bank_account_no: "XXXXXXXXXX",
                settlement_ifsc_code: "XXXXXXXXX",
                beneficiary_name: "xxxxx",
                bank_name: "xxxx",
                branch_name: "xxxx",
              },
            ],
          },
        ],
        created_at: timestamp,
        updated_at: timestamp,
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${context.bpp_uri}${
        context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
      }`,
      `confirm`,
      "b2b"
    );
  } catch (error) {
    return next(error);
  }
};
