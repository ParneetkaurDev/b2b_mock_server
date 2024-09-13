import { NextFunction, Request, Response } from "express";
import {
  B2C_BAP_MOCKSERVER_URL,
  MOCKSERVER_ID,
  send_nack,
  send_response,
  redisFetchToServer,
  B2C_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initiateSelectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario, transactionId } = req.body;
    const on_search = await redisFetchToServer(ON_ACTION_KEY.ON_SEARCH, transactionId);
    if (!on_search) {
      return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
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
      path.join(B2C_EXAMPLES_PATH, "select/select_exports.yaml")
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
        bap_uri: B2C_BAP_MOCKSERVER_URL,
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
  } catch (err) {
    next(err);
  }
};
