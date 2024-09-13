import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

import {
	responseBuilder,
	send_nack,
	LOGISTICS_EXAMPLES_PATH,
	redis,
	Item,
	Fulfillment,
	Stop,
	Payment,
	SettlementDetails,
	redisFetchFromServer,
	responseBuilder_logistics,
} from "../../../lib/utils";
import { on } from "events";

function getRandomFile(directory: string): string | null {
	const files = fs.readdirSync(directory);
	const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

	if (yamlFiles.length === 0) {
		console.error(`No YAML files found in directory: ${directory}`);
		return null;
	}

	const randomIndex = Math.floor(Math.random() * yamlFiles.length);

	return path.join(directory, yamlFiles[randomIndex]);
}

export const statusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";

	if (!sandboxMode) {
		try {
			const domain = req.body.context.domain;
			let directory: string;

			// Determine the directory based on the domain
			switch (domain) {
				case "ONDC:LOG10":
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_status"
					);
					break;

				case "ONDC:LOG11":
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/on_status"
					);
					break;

				default:
					// Fallback to the LOG10 directory if the domain is not recognized
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_status"
					);
					break;
			}

			const file = getRandomFile(directory);
			if (!file) {
				return null; // Return null or handle this case as needed
			}

			const fileContent = fs.readFileSync(file, "utf8");
			const response = YAML.parse(fileContent);

			return responseBuilder_logistics(
				res,
				next,
				response.value.context,
				response.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
				}`,
				`on_status`,
				"logistics"
			);
		} catch (error) {
			return next(error);
		}
	} else {
		try {
			const transactionId = req.body.context.transaction_id;
			const onConfirm = await redisFetchFromServer("on_confirm", transactionId);
			const onCancel = await redisFetchFromServer("on_cancel", transactionId);
			const onUpdate = await redisFetchFromServer("on_update", transactionId);
			var onStatus;
			var newTime = new Date().toISOString();
			if (onCancel != null) {
				onStatus = {
					context: {
						...onCancel.context,
						message_id: req.body.context.message_id,
						timestamp: newTime,
						action: "on_status",
					},
					message: {
						...onCancel.message,
					},
				};
			} else if (onUpdate != null) {
				onStatus = {
					context: {
						...onUpdate.context,
						message_id: req.body.context.message_id,
						timestamp: newTime,
						action: "on_status",
					},
					message: {
						...onUpdate.message,
					},
				};
			}else{
				onStatus = {
					context : {
						...onConfirm.context,
						message_id : req.body.context.message_id,
						timestamp : newTime,
						action : "on_status"
					},
					message : {
						order:{
							id: onConfirm.message.order.id,
							status: "Accepted",
							provider: onConfirm.message.order.provider,
							items: onConfirm.message.order.items,
							quote: onConfirm.message.order.quote,
							fulfillments: onConfirm.message.order.fulfillments,
							billing: onConfirm.message.order.billing,
							payments: onConfirm.message.order.payments,
							tags: onConfirm.message.order.tags,
							updated_at: newTime
						}
					}
				};
			}
			return responseBuilder_logistics(
				res,
				next,
				onStatus.context,
				onStatus.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
				}`,
				`on_status`,
				"logistics"
			);
		} catch (error) {
			next(error);
		}
	}
};

const statusRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string
) => {
	try {
		const timestamp = new Date().toISOString();

		const responseMessage: any = {
			order: {
				id: transaction.message.order.id,
				state: "Completed",
				provider: {
					...transaction.message.order.provider,
					rateable: undefined,
				},
				billing: {
					...transaction.message.order.billing,
					tax_id: undefined,
				},
				items: transaction.message.order.items.map((item: Item) => ({
					id: item.id,
					fulfillment_ids: item.fulfillment_ids,
					quantity: item.quantity,
				})),
				fulfillments: transaction.message.order.fulfillments.map(
					(fulfillment: Fulfillment) => ({
						...fulfillment,
						stops: fulfillment.stops.map((stop: Stop) => {
							// Add the instructions to both start and end stops
							const instructions = {
								name: "Proof of pickup",
								short_desc: "Proof of pickup details",
								long_desc: "Proof of pickup details",
								images: ["https://image1_url.png"],
							};
							if (!Object.keys(stop).includes("time"))
								stop.time = {
									range: {
										start: new Date().toISOString(),
										end: new Date().toISOString(),
									},
									timestamp: new Date().toISOString(),
								};
							// Check if the stop type is "end"
							if (stop.type === "end") {
								// Add the agent object to the stop
								return {
									...stop,
									instructions: {
										...instructions,
										name: "Proof of delivery",
										short_desc: "Proof of delivery details",
										long_desc: "Proof of delivery details",
									},
									location: {
										...stop.location,
									},
									agent: {
										person: {
											name: "Ramu",
										},
										contact: {
											phone: "9886098860",
										},
									},
								};
							} else if (stop.type === "start") {
								// For stops of type "start", add the instructions and location modifications
								return {
									...stop,
									instructions,
									location: {
										...stop.location,
										descriptor: {
											...stop.location?.descriptor,
											images: ["https://gf-integration/images/5.png"],
										},
									},
								};
							} else {
								// For other types, return the stop as is with instructions
								return {
									...stop,
									instructions,
								};
							}
						}),
						rateable: undefined,
					})
				),
				quote: transaction.message.order.quote,
				payments: transaction.message.order.payments.map(
					(payment: Payment) => ({
						...payment,
						tl_method: "http/get",
						params: {
							...payment.params,
							transaction_id: "3937",
						},
						"@ondc/org/settlement_details": payment[
							"@ondc/org/settlement_details"
						]?.map((itm: SettlementDetails) => ({
							...itm,
							settlement_counterparty: "seller-app",
							settlement_reference: "XXXX",
							settlement_status: "PAID",
							settlement_timestamp: "2023-02-04T10:00:00.000Z",
						})),
						tags: undefined,
					})
				),
				tags: undefined,
				created_at: timestamp,
				updated_at: timestamp,
			},
		};

		responseMessage.order.payments.forEach(
			(itm: Payment) => (itm.status = "PAID")
		);

		switch (scenario) {
			case "delivered":
				responseMessage.order.documents = [
					{
						url: "https://invoice_url",
						label: "Invoice",
					},
				];
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
				);
				break;
			case "out-for-delivery":
				responseMessage.order.state = "In-progress";
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Out-for-delivery")
				);
				break;
			case "picked-up":
				responseMessage.order.state = "In-progress";
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Order-picked-up")
				);
				break;
			case "proforma-invoice":
				responseMessage.order.state = "Accepted";
				responseMessage.order.documents = [
					{
						url: "https://invoice_url",
						label: "PROFORMA_INVOICE",
					},
				];
				responseMessage.order.payments.forEach((itm: Payment) => {
					delete itm.tl_method;
					delete itm.uri;
				});
				responseMessage.order.payments.forEach((itm: Payment) => {
					itm.status = "NOT-PAID";
				});
				responseMessage.order.payments.forEach((itm: Payment) =>
					itm["@ondc/org/settlement_details"]?.forEach(
						(itm: SettlementDetails) => {
							delete itm.settlement_status;
							delete itm.settlement_timestamp;
						}
					)
				);
				break;
			case "bpp-payment-error":
				responseMessage.error = {
					code: "31004",
					message: "Payment Failed",
				};
				responseMessage.order.payments.forEach(
					(itm: Payment) => (itm.status = "NOT-PAID")
				);
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
				);
				responseMessage.order.payments.forEach((itm: Payment) =>
					itm["@ondc/org/settlement_details"]?.forEach(
						(itm: SettlementDetails) => {
							delete itm.settlement_reference;
							delete itm.settlement_status;
							delete itm.settlement_timestamp;
							itm.settlement_counterparty = "buyer-app";
						}
					)
				);
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
				);
				break;
			case "bpp-payment":
				responseMessage.order.payments.forEach((itm: Payment) =>
					itm["@ondc/org/settlement_details"]?.forEach(
						(itm: SettlementDetails) => {
							delete itm.settlement_reference;
							delete itm.settlement_status;
							delete itm.settlement_timestamp;
							itm.settlement_counterparty = "buyer-app";
						}
					)
				);
				break;
			case "self-picked-up":
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "order-picked-up")
				);
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.type = "Self-Pickup")
				);
				break;
			default:
				responseMessage.order.documents = [
					{
						url: "https://invoice_url",
						label: "Invoice",
					},
				];
				responseMessage.order.fulfillments.forEach(
					(itm: Fulfillment) => (itm.state.descriptor.code = "Order-delivered")
				);
				break;
		}

		return responseBuilder(
			res,
			next,
			req.body.context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
			}`,
			`on_status`,
			"logistics"
		);
	} catch (error) {
		next(error);
	}
};
