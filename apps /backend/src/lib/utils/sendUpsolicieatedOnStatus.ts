import {
	AGRI_HEALTHCARE_STATUS,
	ALL_DOMAINS,
	SERVICES_DOMAINS,
} from "./apiConstants";
import { Fulfillment, Stop } from "./interfaces";
import {
	findIncompleteOnConfirmCalls,
	redisFetchFromServer,
} from "./redisFetch";
import { sendStatusAxiosCall } from "./responseBuilder";

export const sendUpsolicieatedOnStatus = async () => {
	try {
		// steps
		// 1. find all the on confirm call which status in not completed (or find only those which timestemp is not less then 5 min)
		let nextStatus: string = AGRI_HEALTHCARE_STATUS[0];
		let lastStatus: string = AGRI_HEALTHCARE_STATUS[0];
		let data: any = await findIncompleteOnConfirmCalls();
		
		if (data && data.length > 0) {
			data.map(async (ele: any) => {
				// 2. find on_status data with latest  state of the order based on transaction id
				const on_status = await redisFetchFromServer(
					"on_status",
					ele?.request?.context?.transaction_id
				);

				if (on_status) {
					const { message } = on_status;
					//UPDATE SCENARIO TO NEXT STATUS
					lastStatus = message?.order?.fulfillments[0]?.state?.descriptor?.code;
					//FIND NEXT STATUS
					const lastStatusIndex = AGRI_HEALTHCARE_STATUS.indexOf(lastStatus);
					if (
						lastStatusIndex !== -1 &&
						lastStatusIndex < AGRI_HEALTHCARE_STATUS.length - 1
					) {
						const nextStatusIndex = lastStatusIndex + 1;
						nextStatus = AGRI_HEALTHCARE_STATUS[nextStatusIndex];
					}

          
				}
        const { message, context } = ele?.request;

				//CHECK LAST STATUS IS ALREADY COMPLETED OR NOT
				if (
					lastStatus !== AGRI_HEALTHCARE_STATUS[6] &&
					(context?.domain === SERVICES_DOMAINS.HEALTHCARE_SERVICES ||
					 context?.domain === SERVICES_DOMAINS.AGRI_SERVICES)
				) {
					// 3. prepare on status payload based on old data with new status
					const responseMessage: any = {
						order: {
							id: message.order.id,
							status: "In-progress",
							provider: {
								...message?.order?.provider,
								rateable: undefined,
							},
							items: message?.order?.items,
							billing: { ...message?.order?.billing, tax_id: undefined },
							fulfillments: message?.order?.fulfillments?.map(
								(fulfillment: Fulfillment) => ({
									...fulfillment,
									id: fulfillment.id,
									state: {
										descriptor: {
											code: "IN_TRANSIT",
										},
									},
									stops: fulfillment?.stops?.map((stop: Stop) => {
										const demoObj = {
											...stop,
											id: undefined,
											authorization: stop?.authorization
												? { ...stop?.authorization, status: "confirmed" }
												: undefined,
											person: stop?.person ? stop?.person : stop?.customer?.person,
										};
										if (stop.type === "start") {
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
							quote: message?.order?.quote,
							payments: message?.order?.payments,
							documents: [
								{
									url: "https://invoice_url",
									label: "INVOICE",
								},
							],
							created_at: message?.order?.created_at,
							updated_at: message?.order?.updated_at,
						},
					};

					switch (nextStatus) {
						case "IN_TRANSIT":
							responseMessage?.order?.fulfillments?.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment?.stops?.forEach((stop: Stop) =>
										stop?.authorization
											? (stop.authorization = undefined)
											: undefined
									);
								}
							);
							break;
						case "AT_LOCATION":
							responseMessage?.order?.fulfillments.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "AT_LOCATION";
									fulfillment?.stops?.forEach((stop: Stop) =>
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
						case "COLLECTED_BY_AGENT":
							responseMessage?.order?.fulfillments.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "COLLECTED_BY_AGENT";
								}
							);
							break;
						case "RECEIVED_AT_LAB":
							responseMessage?.order?.fulfillments.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "RECEIVED_AT_LAB";
								}
							);
							break;
						case "TEST_COMPLETED":
							responseMessage?.order?.fulfillments?.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "TEST_COMPLETED";
									fulfillment.stops.forEach((stop: Stop) =>
										stop?.authorization
											? (stop.authorization = undefined)
											: undefined
									);
								}
							);
							break;
						case "REPORT_GENERATED":
							responseMessage?.order?.fulfillments.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "REPORT_GENERATED";
								}
							);
							break;
						case "REPORT_SHARED":
							responseMessage.order.status = "Completed";
							responseMessage?.order?.fulfillments.forEach(
								(fulfillment: Fulfillment) => {
									fulfillment.state.descriptor.code = "REPORT_SHARED";
								}
							);
							break;
						case "cancel":
							responseMessage.order.status = "Cancelled";
							break;
						default: //service started is the default case
							break;
					}
					// 4. collect bpp url from context
					// 5. trigger axios call on bpp url for all the request you have found from on_status
					await sendStatusAxiosCall(
						context,
						responseMessage,
						`${context.bap_uri}${
							context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
						}`,
						`on_status`,
						context?.domain === SERVICES_DOMAINS.HEALTHCARE_SERVICES
							? "healthcare-service"
							: "agri-services"
					);
				}
			});
		}
	} catch (error: any) {
		console.log("error sendUpsolicieatedOnStatus ======", error);
	}
};

// call this function sendUpsolicieatedOnStatus on a interval of 30 second useing cron npm package
