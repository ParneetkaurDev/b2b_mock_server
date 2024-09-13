import { NextFunction, Request, Response } from "express";
import {
  B2B_BAP_MOCKSERVER_URL,
  B2B_EXAMPLES_PATH,
  MOCKSERVER_ID,
  send_response,
  send_nack,
  createAuthHeader,
  logger,
  redis,
  Payment,
  Fulfillment,
} from "../../../lib/utils";
import axios from "axios";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateInitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario, transactionId } = req.body;

    const transactionKeys = await redis.keys(`${transactionId}-*`);
    const ifTransactionExist = transactionKeys.filter((e) =>
      e.includes("on_select-to-server")
    );

    if (ifTransactionExist.length === 0) {
      return send_nack(res, "On Select doesn't exist");
    }
    const transaction = await redis.mget(ifTransactionExist);
    const parsedTransaction = transaction.map((ele) => {
      return JSON.parse(ele as string);
    });

    const request = parsedTransaction[0].request;
    if (Object.keys(request).includes("error")) {
      return send_nack(res, "On Select had errors");
    }

    // console.log("parsedTransaction:::: ", parsedTransaction[0]);
    return intializeRequest(res, next, request, scenario);
  } catch (error) {
    return next(error);
  }
};

const intializeRequest = async (
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  try {
    const {
      context,
      message: {
        order: { provider, items, fulfillments },
      },
    } = transaction;
    let { payments } = transaction.message.order;
    const { transaction_id } = context;

    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "init/init_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    payments = payments.map((payment: Payment) => {
      if (scenario === "prepaid-bpp-payment") {
        return {
          ...payment,
          type: "PRE-FULFILLMENT",
          collected_by: "BPP",
        };
      } else if (scenario === "prepaid-bap-payment") {
        return {
          ...payment,
          type: "PRE-FULFILLMENT",
          collected_by: "BAP",
        };
      } else {
        return {
          ...payment,
          type: "ON-FULFILLMENT",
          collected_by: "BPP",
        };
      }
    });

    const init = {
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        action: "init",
        bap_id: MOCKSERVER_ID,
        bap_uri: B2B_BAP_MOCKSERVER_URL,
        // bpp_id: MOCKSERVER_ID,
        // bpp_uri,
        ttl: "PT30S",
        message_id: uuidv4(),
      },
      message: {
        order: {
          ...response.value.message.order,
          provider,
          items,
          payments,
          fulfillments: fulfillments.map((fulfillment: Fulfillment) => ({
            ...response.value.message.order.fulfillments[0],
            id: fulfillment.id,
          })),
        },
      },
    };
    await send_response(
      res,
      next,
      init,
      transaction_id,
      "init",
      (scenario = scenario)
    );
    // const header = await createAuthHeader(init);
    // try {
    // 	await redis.set(
    // 		`${transaction_id}-init-from-server`,
    // 		JSON.stringify({ request: { ...init } })
    // 	);
    // 	const response = await axios.post(
    // 		`${context.bpp_uri}/init?scenario=${scenario}`,
    // 		init,
    // 		{
    // 			headers: {
    // 				// "X-Gateway-Authorization": header,
    // 				authorization: header,
    // 			},
    // 		}
    // 	);

    // 	await redis.set(
    // 		`${transaction_id}-init-from-server`,
    // 		JSON.stringify({
    // 			request: { ...init },
    // 			response: {
    // 				response: response.data,
    // 				timestamp: new Date().toISOString(),
    // 			},
    // 		})
    // 	);

    // 	return res.json({
    // 		message: {
    // 			ack: {
    // 				status: "ACK",
    // 			},
    // 		},
    // 		transaction_id,
    // 	});
    // } catch (error) {
    // 	return next(error);
    // }
  } catch (error) {
    next(error);
  }
};
