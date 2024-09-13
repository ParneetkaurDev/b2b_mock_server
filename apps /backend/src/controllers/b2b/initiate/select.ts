import { NextFunction, Request, Response } from "express";
import {
  B2B_BAP_MOCKSERVER_URL,
  B2B_EXAMPLES_PATH,
  MOCKSERVER_ID,
  send_nack,
  send_response,
  createAuthHeader,
  logger,
  redis,
  redisFetchToServer,
} from "../../../lib/utils";
import axios from "axios";
import fs from "fs";
import path from "path";
import YAML from "yaml";

import { v4 as uuidv4 } from "uuid";
import { set } from "lodash";
import { AxiosError } from "axios";

export const initiateSelectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario, transactionId } = req.body;

    // const transactionKeys = await redis.keys(`${transactionId}-*`);
    // const ifTransactionExist = transactionKeys.filter((e) =>
    // 	e.includes("on_search-to-server")
    // );

    // if (ifTransactionExist.length === 0) {
    // 	send_nack(res,"On Search doesn't exist")
    // }
    // const transaction = await redis.mget(ifTransactionExist);
    // const parsedTransaction = transaction.map((ele) => {
    // 	return JSON.parse(ele as string);
    // });

    const on_search = await redisFetchToServer("on_search", transactionId);
    if (!on_search) {
      return send_nack(res, "On Search doesn't exist");
    }
    return intializeRequest(res, next, on_search, scenario);
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
    const { context, message } = transaction;
    const { transaction_id } = context;

    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "select/select_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    if (scenario !== "rfq") {
      delete response.value.message.order.items[0].tags;
    }
    const select = {
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        action: "select",
        message_id: uuidv4(),
        ttl: scenario === "rfq" ? "P1D" : "PT30S",
        bap_id: MOCKSERVER_ID,
        bap_uri: B2B_BAP_MOCKSERVER_URL,
      },
      message: {
        order: {
          provider: {
            id: message.catalog.providers[0].id,
            locations: [
              {
                id: message.catalog.providers[0].items[0].location_ids[0],
              },
            ],
            ttl: scenario === "rfq" ? "P1D" : "PT30S",
          },
          items: [
            {
              ...response.value.message.order.items[0],
              id: message.catalog.providers[0].items[0].id,
              location_ids: [
                message.catalog.providers[0].items[0].location_ids[0],
              ],
              fulfillment_ids: [
                message.catalog.providers[0].items[0].fulfillment_ids[0],
              ],
            },
          ],
          fulfillments: [
            {
              ...message.catalog.fulfillments[0],
              type: message.catalog.providers[0].items[0].fulfillment_ids[0],
            },
          ],
          payments: [message.catalog.payments[0]],
          tags: response.value.message.order.tags,
        },
      },
    };
    await send_response(
      res,
      next,
      select,
      transaction_id,
      "select",
      (scenario = scenario)
    );
    // const header = await createAuthHeader(select);
    // try {
    // 	await redis.set(
    // 		`${transaction_id}-select-from-server`,
    // 		JSON.stringify({ request: { ...select } })
    // 	);
    // 	const response = await axios.post(
    // 		`${context.bpp_uri}/select?scenario=${scenario}`,
    // 		select,
    // 		{
    // 			headers: {
    // 				// "X-Gateway-Authorization": header,
    // 				authorization: header,
    // 			},
    // 		}
    // 	);

    // 	await redis.set(
    // 		`${transaction_id}-select-from-server`,
    // 		JSON.stringify({
    // 			request: { ...select },
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
    // 	await redis.set(
    // 		`${transaction_id}-select-from-server`,
    // 		JSON.stringify({
    // 			request: { ...select },
    // 			response: {
    // 				response: error instanceof AxiosError ? error.response : error,
    // 				timestamp: new Date().toISOString(),
    // 			},
    // 		})
    // 	);

    // 	return next(error);
    // }
  } catch (err) {
    next(err);
  }
};
