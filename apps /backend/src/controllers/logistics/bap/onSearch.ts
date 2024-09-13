import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSearchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";

	if (!sandboxMode) {
		try {
			let domain = req.body.context.domain;
			let init;
			switch (domain) {
				case "ONDC:LOG10":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/init/init_air.yaml"
						)
					);
					init = YAML.parse(file.toString());
					break;
				case "ONDC:LOG11":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Int_Logistics_yaml/init/init_air.yaml"
						)
					);
					init = YAML.parse(file.toString());
					break;
				default:
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/init/init_air.yaml"
						)
					);
					init = YAML.parse(file.toString());
					break;
			}
			return responseBuilder_logistics(
				res,
				next,
				init.value.context,
				init.value.message,
				`${req.body.context.bpp_uri}${
					req.body.context.bpp_uri.endsWith("/") ? "init" : "/init"
				}`,
				`init`,
				"logistics"
			);
		} catch (error) {
			next(error);
		}
	} else {
	}
};
