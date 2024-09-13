import { NextFunction, Request, Response } from "express";
import {
	AGRI_HEALTHCARE_STATUS,
	AGRI_HEALTHCARE_STATUS_OBJECT,
	BID_AUCTION_STATUS,
	EQUIPMENT_HIRING_STATUS,
	FULFILLMENT_LABELS,
	ORDER_STATUS,
	SERVICES_DOMAINS,
} from "../../../lib/utils/apiConstants";
import axios, { AxiosError } from "axios";
import {
	Fulfillment,
	Stop,
	redisExistFromServer,
	redisFetchFromServer,
	responseBuilder,
	send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { UpdateControllerdemo } from "./update";
import { SERVICES_BPP_MOCKSERVER_URL,MOCKSERVER_ID } from "../../../lib/utils";
import { createAuthHeader,TransactionType,logger,redis } from "../../../lib/utils";

export const statusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let scenario: string = String(req.query.scenario) || "";//placed
		const { transaction_id } = req.body.context;
		const on_confirm_data = await redisFetchFromServer(
			ON_ACTION_KEY.ON_CONFIRM,
			transaction_id
		);

		if (!on_confirm_data) {
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}

		const on_cancel_exist = await redisExistFromServer(
			ON_ACTION_KEY.ON_CANCEL,
			transaction_id
		);
		if (on_cancel_exist) {
			scenario = "cancel";
		}
		console.log(`at statusController Bpp scenario:${scenario},on confirm data :${on_confirm_data}`)
		return statusRequest(req, res, next, on_confirm_data, scenario);
	} catch (error) {
		return next(error);
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
		console.log("atStatusRequest")
		const { context, message } = transaction;
		context.action = ON_ACTION_KEY.ON_STATUS;
		console.log(`context at STatus Request ${context} and check domain`)
		const domain = context?.domain;
		const on_status = await redisFetchFromServer(
			ON_ACTION_KEY.ON_STATUS,
			req.body.context.transaction_id
		);
		let next_status = scenario;
		console.log(`status Reqquest next status:${next_status},on status:${on_status}`)
		if (on_status) {
			//UPDATE SCENARIO TO NEXT STATUS
			const lastStatus =
				on_status?.message?.order?.fulfillments[0]?.state?.descriptor?.code;

			//FIND NEXT STATUS
			let lastStatusIndex: any = 0;
			switch (domain) {
				case SERVICES_DOMAINS.SERVICES || SERVICES_DOMAINS.AGRI_EQUIPMENT:
					lastStatusIndex = EQUIPMENT_HIRING_STATUS.indexOf(lastStatus);
					if (lastStatusIndex === 2) {
						next_status = lastStatus;
					}
					if (
						lastStatusIndex !== -1 &&
						lastStatusIndex < EQUIPMENT_HIRING_STATUS.length - 1
					) {
						const nextStatusIndex = lastStatusIndex + 1;
						next_status = EQUIPMENT_HIRING_STATUS[nextStatusIndex];
					}
					break;
				case SERVICES_DOMAINS.BID_ACTION_SERVICES:
					lastStatusIndex = BID_AUCTION_STATUS.indexOf(lastStatus);
					if (lastStatusIndex === 1) {
						next_status = lastStatus;
					}
					if (
						lastStatusIndex !== -1 &&
						lastStatusIndex < BID_AUCTION_STATUS.length - 1
					) {
						console.log("condn verified")
						const nextStatusIndex = lastStatusIndex + 1;
						next_status = BID_AUCTION_STATUS[nextStatusIndex];
					}
					break;
				default: //service started is the default case
					lastStatusIndex = AGRI_HEALTHCARE_STATUS.indexOf(lastStatus);
					if (lastStatus === 6) {
						next_status = lastStatus;
					}
					if (
						lastStatusIndex !== -1 &&
						lastStatusIndex < AGRI_HEALTHCARE_STATUS.length - 1
					) {
						const nextStatusIndex = lastStatusIndex + 1;
						next_status = AGRI_HEALTHCARE_STATUS[nextStatusIndex];
					}
					break;
			}
		}
		scenario = scenario ? scenario : next_status;
		console.log("req at Status Request",req)

		let UpdateResponde:object={
			order: {
				id: message.order.id,
				status: ORDER_STATUS.IN_PROGRESS,
				provider: {
					id:message.order.provider.id,
				},
				items: [{
					id:message.order.items[0].id,
					price:{
							currency:"INR",
							offered_value:message.order.items[0].price.offered_value
					},
					quantity:message.order.items[0].quantity,
					payment_ids:"PY2",
				}],
				fullfillments:[
					{
						id:message.order.fulfillments[0].id,
						state:{
							descriptor:{
								code:"AWAREDED"
							}
						},
						stops:message.order.fulfillments[0].stops,
						rateable:"true"
					}
				],
				quote:message.order.quote,
				payments:message.order.payments,
		}
	}


		const responseMessage: any = {
			order: {
				id: message.order.id,
				status: ORDER_STATUS.IN_PROGRESS,
				provider: {
					...message.order.provider,
					rateable: undefined,
				},
				items: message.order.items,
				billing: { ...message.order.billing, tax_id: undefined },

				fulfillments: message.order.fulfillments.map(
					(fulfillment: Fulfillment) => ({
						...fulfillment,
						id: fulfillment.id,
						state: {
							descriptor: {
								code: AGRI_HEALTHCARE_STATUS_OBJECT.IN_TRANSIT,
							},
						},

						stops: fulfillment.stops.map((stop: Stop) => {
							const demoObj = {
								...stop,
								id: undefined,
								authorization: stop.authorization
									? {
											...stop.authorization,
											status: FULFILLMENT_LABELS.CONFIRMED,
									  }
									: undefined,
								person: stop.person ? stop.person : stop.customer?.person,
							};
							if (stop.type === "start"){
								return {
									...demoObj,
									location: {
										...stop.location,
										descriptor: {
											...stop.location?.descriptor,
											images: ["https://gf-integration/images/5.png"],
										},
									},
								};
							}
							return demoObj;
						}),
						rateable: undefined,
					})
				),
				quote: message.order.quote,
				payments: message.order.payments,
				documents: [
					{
						url: "https://invoice_url",
						label: "INVOICE",
					},
				],
				created_at: message.order.created_at,
				updated_at: message.order.updated_at,
			},
		};

		switch (scenario) {
			case AGRI_HEALTHCARE_STATUS_OBJECT.IN_TRANSIT:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.IN_TRANSIT;
						fulfillment.stops.forEach((stop: Stop) =>
							stop?.authorization ? (stop.authorization = undefined) : undefined
						);
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.AT_LOCATION:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.AT_LOCATION;
						fulfillment.stops.forEach((stop: Stop) =>
							stop?.authorization
								? (stop.authorization = {
										...stop.authorization,
										status: "valid",
								  })
								: undefined
						);
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.COLLECTED_BY_AGENT:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.COLLECTED_BY_AGENT;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.RECEIVED_AT_LAB:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.RECEIVED_AT_LAB;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.TEST_COMPLETED:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.TEST_COMPLETED;
						fulfillment.stops.forEach((stop: Stop) =>
							stop?.authorization ? (stop.authorization = undefined) : undefined
						);
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.REPORT_GENERATED:
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.REPORT_GENERATED;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.REPORT_SHARED:
				responseMessage.order.status = AGRI_HEALTHCARE_STATUS_OBJECT.COMPLETED;
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.REPORT_SHARED;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.COMPLETED:
				responseMessage.order.status = AGRI_HEALTHCARE_STATUS_OBJECT.COMPLETED;
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.REPORT_SHARED;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.PLACED:
				// responseMessage.order.status = AGRI_HEALTHCARE_STATUS_OBJECT.COMPLETED;
				responseMessage.order.fulfillments.forEach(
					(fulfillment: Fulfillment) => {
						fulfillment.state.descriptor.code =
							AGRI_HEALTHCARE_STATUS_OBJECT.PLACED;
					}
				);
				break;
			case AGRI_HEALTHCARE_STATUS_OBJECT.CANCEL:
				responseMessage.order.status = "Cancelled";
				break;
			default: //service started is the default case
				break;
		}

		setTimeout(()=>{OnUpdateResponseBuilder(res,context,UpdateResponde,`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		"on_update")},2000)

		return responseBuilder(
			res,
			next,
			req.body.context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_STATUS
					: `/${ON_ACTION_KEY.ON_STATUS}`
			}`,
			`${ON_ACTION_KEY.ON_STATUS}`,
			"services"
		);

	} catch (error) {
		next(error);
	}
	

};


export const OnUpdateResponseBuilder = async(
	res: Response,
	reqContext: object,
	message: object,
	uri: string,
	action: string,
	error?: object | undefined
)=>{
	const ts=new Date()
	const sandboxMode = res.getHeader("mode") === "sandbox";
	let async: { message: object; context?: object; error?: object } = {
		context: {},
		message,
	};
	console.log("flow to OnUpdateResponseBuilder",reqContext,message)
	const bppURI = SERVICES_BPP_MOCKSERVER_URL;
	async = {
		...async,
		context: {
			...reqContext,
			bpp_id: MOCKSERVER_ID,
			bpp_uri: bppURI,
			timestamp: ts.toISOString(),
			action: action,
		},
	};

	if (error) {
		async = { ...async, error };
	}
	console.log("mock",sandboxMode,"uriiii",uri)
	const header = await createAuthHeader(async);
	if (sandboxMode) {
		var log: TransactionType = {
			request: async,
		};
	console.log("insidesandbox")

	try {
		
		const response = await axios.post(uri + "?mode=mock", async, {
			headers: {
				authorization: header,
			},
		});

		log.response = {
			timestamp: new Date().toISOString(),
			response: response.data,
		};

		await redis.set(
			`${
				(async.context! as any).transaction_id
			}-${action}-from-server-${ts.toISOString()}`, 
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
			`${
				(async.context! as any).transaction_id
			}-${action}-from-server-${ts.toISOString()}`,
			JSON.stringify(log)
		);

		if (error instanceof AxiosError  && action === "on_confirm") {
			res.status(error.status || 500).json(error);
		}

		if (error instanceof AxiosError) {
			console.log(error.response?.data);
		}

		throw error;
	}

	logger.info({
		type: "response",
		action: action,
		transaction_id: (reqContext as any).transaction_id,
		message: { sync: { message: { ack: { status: "ACK" } } } },
	});

	return;
} else {
	logger.info({
		type: "response",
		action: action,
		transaction_id: (reqContext as any).transaction_id,
		message: { sync: { message: { ack: { status: "ACK" } } } },
	});

	return;
}
}
