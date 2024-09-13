import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onCancelController = (
  req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";
  if(!sandboxMode)
    {
      return res.json({
        sync: {
          message: {
            ack: {
              status: "ACK",
            },
          },
        },
        async: {},
      }); 
    }else{

    }
};
