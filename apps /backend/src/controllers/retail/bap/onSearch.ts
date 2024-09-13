import { NextFunction, Request, Response } from "express";
import { responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSearchController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { scenario } = req.query;
    switch (scenario) {
      case "rfq":
        onSearchDomesticController(req, res, next);
        break;
      case "non-rfq":
        onSearchDomesticNonRfqController(req, res, next);
        break;
      case "bap-chat":
        onSearchBAPchatController(req, res, next);
        break;
      default:
        onSearchDomesticController(req, res, next);
        break;
    }
  } catch (error) {
    return next(error);
  }
};

const onSearchDomesticController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { context, message } = req.body;
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "select/select_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    const responseMessage = {
      order: {
        provider: {
          id: message.catalog.providers[0].id,
          locations: [
            {
              id: message.catalog.providers[0].items[0].location_ids[0],
            },
          ],
          ttl: context.ttl,
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
            ...response.value.message.order.fulfillments[0],
            type: message.catalog.providers[0].items[0].fulfillment_ids[0],
          },
        ],
        payments: [message.catalog.payments[0]],
        tags: response.value.message.order.tags,
      },
    };
    return responseBuilder(
      res,
      next,
      { ...context, ttl: "P1D" },
      responseMessage,
      `${context.bpp_uri}${
        context.bpp_uri.endsWith("/") ? "select" : "/select"
      }`,
      `select`,
      "retail"
    );
  } catch (error) {
    next(error);
  }
};

const onSearchDomesticNonRfqController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { context, message } = req.body;
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "select/select_domestic(Non RFQ).yaml")
    );
    const response = YAML.parse(file.toString());
    const responseMessage = {
      order: {
        provider: {
          id: message.catalog.providers[0].id,
          locations: [
            {
              id: message.catalog.providers[0].items[0].location_ids[0],
            },
          ],
          ttl: context.ttl,
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
            ...response.value.message.order.fulfillments[0],
            type: message.catalog.providers[0].items[0].fulfillment_ids[0],
          },
        ],
        payments: [message.catalog.payments[0]],
        tags: response.value.message.order.tags,
      },
    };

    return responseBuilder(
      res,
      next,
      { ...context, ttl: "PT30S" },
      responseMessage,
      `${context.bpp_uri}${
        context.bpp_uri.endsWith("/") ? "select" : "/select"
      }`,
      `select`,
      "retail"
    );
  } catch (error) {
    next(error);
  }
};

const onSearchBAPchatController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "select/select_BAP_chat.yaml")
    );
    const response = YAML.parse(file.toString());

    return responseBuilder(
      res,
      next,
      req.body.context,
      response.value.message,
      `${req.body.context.bpp_uri}${
        req.body.context.bpp_uri.endsWith("/") ? "select" : "/select"
      }`,
      `select`,
      "retail"
    );
  } catch (error) {
    next(error);
  }
};
