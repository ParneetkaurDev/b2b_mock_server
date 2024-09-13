import { NextFunction, Request, Response } from "express";
import {
  B2B_BAP_MOCKSERVER_URL,
  B2B_EXAMPLES_PATH,
  MOCKSERVER_ID,
  send_response
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateSearchController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bpp_uri, city, domain } = req.body;
    const file = fs.readFileSync(
      path.join(B2B_EXAMPLES_PATH, "search/search_by_category.yaml")
    );
    let search = YAML.parse(file.toString());
    search = search.value;
    const transaction_id = uuidv4();
    search = {
      ...search,
      context: {
        ...search.context,
        timestamp: new Date().toISOString(),
        location: {
          ...search.context.location,
          city: {
            code: city,
          },
        },
        transaction_id,
        message_id: uuidv4(),
        // bpp_id: MOCKSERVER_ID,
        // bpp_uri,
        domain,
        bap_id: MOCKSERVER_ID,
        bap_uri: B2B_BAP_MOCKSERVER_URL,
      },
    };
    search.bpp_uri = bpp_uri;
    await send_response(res, next, search, transaction_id, "search");
    // const header = await createAuthHeader(search);
    // try {
    // 	await redis.set(
    // 		`${transaction_id}-search-from-server`,
    // 		JSON.stringify({ request: { ...search } })
    // 	);
    // 	const response = await axios.post(`${bpp_uri}/search`, search, {
    // 		headers: {
    // 			"X-Gateway-Authorization": header,
    // 			authorization: header,
    // 		},
    // 	});
    // 	await redis.set(
    // 		`${transaction_id}-search-from-server`,
    // 		JSON.stringify({
    // 			request: { ...search },
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
    // 	return next(error)
    // }
  } catch (error) {
    return next(error);
  }
};
