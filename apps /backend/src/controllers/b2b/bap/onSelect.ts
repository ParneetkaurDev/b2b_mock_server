import { NextFunction, Request, Response } from "express";
import { responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSelectController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario } = req.query;
    switch (scenario) {
      case "on-fulfillment":
        onSelectOnFulfillmentController(req, res, next);
        break;
      case "prepaid-bpp-payment":
        onSelectDomesticBPPPaymentController(req, res, next);
        break;
      case "prepaid-bap-payment":
        onSelectDomesticBAPPaymentController(req, res, next);
        break;
      default:
        onSelectOnFulfillmentController(req, res, next);
        break;
    }
  } catch (error) {
    return next(error);
  }
};

const onSelectOnFulfillmentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "init/init_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    const {
      context,
      message: {
        order: { provider, items, fulfillments },
      },
    } = req.body;
    const responseMessage = {
      order: {
        ...response.value.message.order,
        provider,
        items,
        payments: [
          {
            type: "ON-FULFILLMENT",
            collected_by: "BPP",
          },
        ],
        fulfillments: fulfillments.map((fulfillment: any) => ({
          ...response.value.message.order.fulfillments[0],
          id: fulfillment.id,
        })),
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "init" : "/init"}`,
      `init`,
      "b2b"
    );
  } catch (error) {
    next(error);
  }
};

const onSelectDomesticBPPPaymentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "init/init_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    const {
      context,
      message: {
        order: { provider, items, fulfillments },
      },
    } = req.body;
    const responseMessage = {
      order: {
        ...response.value.message.order,
        provider,
        items,
        payments: [
          {
            type: "PRE-FULFILLMENT",
            collected_by: "BPP",
          },
        ],
        fulfillments: fulfillments.map((fulfillment: any) => ({
          ...response.value.message.order.fulfillments[0],
          id: fulfillment.id,
        })),
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "init" : "/init"}`,
      `init`,
      "b2b"
    );
  } catch (error) {
    next(error);
  }
};

const onSelectDomesticBAPPaymentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "init/init_domestic.yaml")
    );
    const response = YAML.parse(file.toString());

    const {
      context,
      message: {
        order: { provider, items, fulfillments },
      },
    } = req.body;
    const responseMessage = {
      order: {
        ...response.value.message.order,
        provider,
        items,
        payments: [
          {
            type: "PRE-FULFILLMENT",
            collected_by: "BAP",
          },
        ],
        fulfillments: fulfillments.map((fulfillment: any) => ({
          ...response.value.message.order.fulfillments[0],
          id: fulfillment.id,
        })),
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "init" : "/init"}`,
      `init`,
      "b2b"
    );
  } catch (error) {
    next(error);
  }
};
