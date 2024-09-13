import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
} from "../../../lib/utils";

import fs from "fs";
import path from "path";
import YAML from "yaml";
export const onInitController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";
	if (!sandboxMode) {
		try {
			let domain = req.body.context.domain;
			let confirm;
			let error = req.body.error;
			if (error === undefined) {
				switch (domain) {
					case "ONDC:LOG10":
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_EXAMPLES_PATH,
								"/B2B_Dom_Logistics_yaml/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
					case "ONDC:LOG11":
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_EXAMPLES_PATH,
								"/B2B_Int_Logistics_yaml/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
					default:
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_EXAMPLES_PATH,
								"/B2B_Dom_Logistics_yaml/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
				}
				return responseBuilder_logistics(
					res,
					next,
					confirm.value.context,
					confirm.value.message,
					`${req.body.context.bpp_uri}${
						req.body.context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
					}`,
					`confirm`,
					"logistics"
				);
			}
		} catch (error) {
			return next(error);
		}
	} else {
	}
};
