import axios from "axios";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { LOGISTICS_BPP_MOCKSERVER_URL, MOCKSERVER_ID } from "./constants";
import { createAuthHeader } from "./responseAuth";
import { logger } from "./logger";
import { TransactionType, redis } from "./redis";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { AxiosError } from "axios";
import { redisFetchFromServer } from "./redisFetch";

interface TagDescriptor {
	code: string;
}

interface TagList {
	descriptor: TagDescriptor;
	value: string;
}

interface Quantity {
	selected: {
		count: number;
	};
}

interface AddOn {
	id: string;
}

interface Tag {
	descriptor: TagDescriptor;
	list: TagList[];
}

interface Item {
	price: any;
	title: any;
	fulfillment_ids: string[];
	id: string;
	quantity: Quantity;
	add_ons: AddOn[];
	tags: Tag[];
}

export const responseBuilder_logistics = async (
	res: Response,
	next: NextFunction,
	reqContext: object,
	message: object,
	uri: string,
	action: string,
	domain: "logistics",
	error?: object | undefined
) => {
	res.locals = {};
	let ts = new Date();
	ts.setSeconds(ts.getSeconds() + 1);
	const sandboxMode = res.getHeader("mode") === "sandbox";

	var async: { message: object; context?: object; error?: object } = {
		context: {},
		message,
	};
	//const bppURI = LOGISTICS_BPP_MOCKSERVER_URL;

	if (action.startsWith("on_") && sandboxMode) {
		// const { bap_uri, bap_id, ...remainingContext } = reqContext as any;
		async = {
			...async,
			context: {
				// ...remainingContext,
				...reqContext,
				// bpp_id: MOCKSERVER_ID,
				// bpp_uri: bppURI,
				timestamp: ts.toISOString(),
				action,
			},
		};
	}
	if (error) {
		async = { ...async, error };
	}
	const header = await createAuthHeader(async);

	if (sandboxMode) {
		if (action.startsWith("on_")) {
			var log: TransactionType = {
				request: async,
			};
			if (action === "on_status") {
				const transactionKeys = await redis.keys(
					`${(async.context! as any).transaction_id}-*`
				);
				const logIndex = transactionKeys.filter((e) =>
					e.includes("on_status-to-server")
				).length;
				await redis.set(
					`${
						(async.context! as any).transaction_id
					}-${logIndex}-${action}-from-server`,
					JSON.stringify(log)
				);
			} else {

				await redis.set(
					`${(async.context! as any).transaction_id}-${action}-from-server`,
					JSON.stringify(log)
				);
			}
			try {
				//console.log(uri);
				console.log(JSON.stringify(async));
				// const response = await axios.post("http://localhost:3000/logistics/bap/on_search", async, {
				// 	headers: {
				// 		authorization: header,
				// 	},
				// });
				
				// log.response = {
				// 	timestamp: new Date().toISOString(),
				// 	response: response.data,
				// };
				await redis.set(
					`${(async.context! as any).transaction_id}-${action}-from-server`,
					JSON.stringify(log)
				);
			} catch (error) {
				const response =
					error instanceof AxiosError
						? error?.response?.data
						: {
								message: {
									ack: {
										status: "NACK",
									},
								},
								error: {
									message: error,
								},
						  };
				log.response = {
					timestamp: new Date().toISOString(),
					response: response,
				};
				await redis.set(
					`${(async.context! as any).transaction_id}-${action}-from-server`,
					JSON.stringify(log)
				);

				return next(error);
			}
		}

		logger.info({
			type: "response",
			action: action,
			transaction_id: (reqContext as any).transaction_id,
			message: { sync: { message: { ack: { status: "ACK" } } } },
		});
		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
		});
	} else {
		return res.json({
			sync: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			async: { context: reqContext, message: message, error: error? error : undefined},
		});
	}
};
