import { NextFunction, Request, Response } from "express";
// import fs from "fs";
// import path from "path";
// import YAML from "yaml";

import {
  responseBuilder,
  send_nack,
  B2B_EXAMPLES_PATH,
  redis,
  Item,
  Fulfillment,
  Stop,
  Payment,
  SettlementDetails,
  redisFetchFromServer,
} from "../../../lib/utils";
// import { stringify } from "querystring";
// import { AnyARecord } from "dns";

export const statusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scenario: string = String(req.query.scenario) || "";
    const { transaction_id } = req.body.context;

    // const transactionKeys = await redis.keys(`${transaction_id}-*`);
    // const ifTransactionExist = transactionKeys.filter((e) =>
    // 	e.includes("on_confirm-from-server")
    // );

    // if (ifTransactionExist.length === 0) {
    // 	send_nack(res,"On Confirm doesn't exist")
    // }
    // const transaction = await redis.mget(ifTransactionExist);
    // const parsedTransaction = transaction.map((ele) => {
    // 	return JSON.parse(ele as string);
    // });
    const on_confirm = await redisFetchFromServer("on_confirm", transaction_id);
    if (!on_confirm) {
      return send_nack(res, "On Confirm doesn't exist");
    }

    return statusRequest(req, res, next, on_confirm, scenario);
  } catch (error) {
    return next(error);
  }
};

const statusRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  try {
    const timestamp = new Date().toISOString();

    const responseMessage: any = {
      order: {
        id: transaction.message.order.id,
        state: "Completed",
        provider: {
          ...transaction.message.order.provider,
          rateable: undefined,
        },
        billing: {
          ...transaction.message.order.billing,
          tax_id: undefined,
        },
        items: transaction.message.order.items.map((item: Item) => ({
          id: item.id,
          fulfillment_ids: item.fulfillment_ids,
          quantity: item.quantity,
        })),
        fulfillments: transaction.message.order.fulfillments.map(
          (fulfillment: Fulfillment) => ({
            ...fulfillment,
            stops: fulfillment.stops.map((stop: Stop) => {
              // Add the instructions to both start and end stops
              const instructions = {
                name: "Proof of pickup",
                short_desc: "Proof of pickup details",
                long_desc: "Proof of pickup details",
                images: ["https://image1_url.png"],
              };
              if (!Object.keys(stop).includes("time"))
                stop.time = {
                  range: {
                    start: new Date().toISOString(),
                    end: new Date().toISOString(),
                  },
                  timestamp: new Date().toISOString(),
                };
              // Check if the stop type is "end"
              if (stop.type === "end") {
                // Add the agent object to the stop
                return {
                  ...stop,
                  instructions: {
                    ...instructions,
                    name: "Proof of delivery",
                    short_desc: "Proof of delivery details",
                    long_desc: "Proof of delivery details",
                  },
                  location: {
                    ...stop.location,
                  },
                  agent: {
                    person: {
                      name: "Ramu",
                    },
                    contact: {
                      phone: "9886098860",
                    },
                  },
                };
              } else if (stop.type === "start") {
                // For stops of type "start", add the instructions and location modifications
                return {
                  ...stop,
                  instructions,
                  location: {
                    ...stop.location,
                    descriptor: {
                      ...stop.location?.descriptor,
                      images: ["https://gf-integration/images/5.png"],
                    },
                  },
                };
              } else {
                // For other types, return the stop as is with instructions
                return {
                  ...stop,
                  instructions,
                };
              }
            }),
            rateable: undefined,
          })
        ),
        quote: transaction.message.order.quote,
        payments: transaction.message.order.payments.map(
          (payment: Payment) => ({
            ...payment,
            tl_method: "http/get",
            params: {
              ...payment.params,
              transaction_id: "3937",
            },
            "@ondc/org/settlement_details": payment[
              "@ondc/org/settlement_details"
            ]?.map((itm: SettlementDetails) => ({
              ...itm,
              settlement_counterparty: "seller-app",
              settlement_reference: "XXXX",
              settlement_status: "PAID",
              settlement_timestamp: "2023-02-04T10:00:00.000Z",
            })),
            tags: undefined,
          })
        ),
        tags: undefined,
        created_at: timestamp,
        updated_at: timestamp,
      },
    };

    responseMessage.order.payments.forEach(
      (itm: Payment) => (itm.status = "PAID")
    );

    switch (scenario) {
      case "delivered":
        responseMessage.order.documents = [
          {
            url: "https://invoice_url",
            label: "Invoice",
          },
        ];
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
        );
        break;
      case "out-for-delivery":
        responseMessage.order.state = "In-progress";
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Out-for-delivery")
        );
        break;
      case "picked-up":
        responseMessage.order.state = "In-progress";
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Order-picked-up")
        );
        break;
      case "proforma-invoice":
        responseMessage.order.state = "Accepted";
        responseMessage.order.documents = [
          {
            url: "https://invoice_url",
            label: "PROFORMA_INVOICE",
          },
        ];
        responseMessage.order.payments.forEach((itm: Payment) => {
          delete itm.tl_method;
          delete itm.uri;
        });
        responseMessage.order.payments.forEach((itm: Payment) => {
          itm.status = "NOT-PAID";
        });
        responseMessage.order.payments.forEach((itm: Payment) =>
          itm["@ondc/org/settlement_details"]?.forEach(
            (itm: SettlementDetails) => {
              delete itm.settlement_status;
              delete itm.settlement_timestamp;
            }
          )
        );
        break;
      case "bpp-payment-error":
        responseMessage.error = {
          code: "31004",
          message: "Payment Failed",
        };
        responseMessage.order.payments.forEach(
          (itm: Payment) => (itm.status = "NOT-PAID")
        );
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
        );
        responseMessage.order.payments.forEach((itm: Payment) =>
          itm["@ondc/org/settlement_details"]?.forEach(
            (itm: SettlementDetails) => {
              delete itm.settlement_reference;
              delete itm.settlement_status;
              delete itm.settlement_timestamp;
              itm.settlement_counterparty = "buyer-app";
            }
          )
        );
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
        );
        break;
      case "bpp-payment":
        responseMessage.order.payments.forEach((itm: Payment) =>
          itm["@ondc/org/settlement_details"]?.forEach(
            (itm: SettlementDetails) => {
              delete itm.settlement_reference;
              delete itm.settlement_status;
              delete itm.settlement_timestamp;
              itm.settlement_counterparty = "buyer-app";
            }
          )
        );
        break;
      case "self-picked-up":
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "order-picked-up")
        );
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.type = "Self-Pickup")
        );
        break;
      default:
        responseMessage.order.documents = [
          {
            url: "https://invoice_url",
            label: "Invoice",
          },
        ];
        responseMessage.order.fulfillments.forEach(
          (itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
        );
        break;
    }

    return responseBuilder(
      res,
      next,
      req.body.context,
      responseMessage,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
      }`,
      `on_status`,
      "b2b"
    );
  } catch (error) {
    next(error);
  }
};
