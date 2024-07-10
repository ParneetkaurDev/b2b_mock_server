import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	HEALTHCARE_SERVICES_EXAMPLES_PATH,
	send_response,
	HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";


export const initiateSearchController = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { bpp_uri, city, domain } = req.body;
		const file = fs.readFileSync(
			path.join(HEALTHCARE_SERVICES_EXAMPLES_PATH, "search/search.yaml")
		);
		let search = YAML.parse(file.toString());
		search = search.value;
		const transaction_id = uuidv4();
		const timestamp = new Date().toISOString();
	
		search = {
			...search,
			context: {
				...search.context,
				timestamp,
				location: {
					...search.context.location,
					city: {
						code: city
					}
				},
				transaction_id,
				// bpp_id: MOCKSERVER_ID,
				// bpp_uri,
				domain,
				bap_id: MOCKSERVER_ID,
				bap_uri: HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
				message_id: uuidv4()
			},
		};
		
		search.bpp_uri = bpp_uri
		await send_response(res, next, search, transaction_id, "search");
	}catch(error){
		return next(error);
	}
};
