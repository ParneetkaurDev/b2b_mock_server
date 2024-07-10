import axios from "axios";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	AGRI_EQUIPMENT_BPP_MOCKSERVER_URL,
	AGRI_SERVICES_BPP_MOCKSERVER_URL,
	B2B_BPP_MOCKSERVER_URL,
	HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	SERVICES_BPP_MOCKSERVER_URL,
} from "./constants";
import { createAuthHeader } from "./responseAuth";
import { logger } from "./logger";
import { TransactionType, redis } from "./redis";
import { AxiosError } from "axios";
import { ON_ACTION_KEY } from "./actionOnActionKeys";
import {
	FULFILLMENT_END,
	FULFILLMENT_LABELS,
	FULFILLMENT_START,
	FULFILLMENT_STATES,
	FULFILLMENT_TYPES,
	SCENARIO,
} from "./apiConstants";

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

export const responseBuilder = async (
	res: Response,
	next: NextFunction,
	reqContext: object,
	message: object,
	uri: string,
	action: string,
	domain:
		| "b2b"
		| "services"
		| "agri-services"
		| "healthcare-service"
		| "agri-equipment-hiring",
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
	const bppURI =
		domain === "b2b"
			? B2B_BPP_MOCKSERVER_URL
			: domain === "agri-services"
			? AGRI_SERVICES_BPP_MOCKSERVER_URL
			: domain === "healthcare-service"
			? HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
			: domain === "agri-equipment-hiring"
			? AGRI_EQUIPMENT_BPP_MOCKSERVER_URL
			: SERVICES_BPP_MOCKSERVER_URL;

	if (action.startsWith("on_")) {
		async = {
			...async,
			context: {
				...reqContext,
				bpp_id: MOCKSERVER_ID,
				bpp_uri: bppURI,
				timestamp: ts.toISOString(),
				action,
			},
		};
	} else {
		// const { bpp_uri, bpp_id, ...remainingContext } = reqContext as any;
		async = {
			...async,
			context: {
				// ...remainingContext,
				...reqContext,
				bap_id: MOCKSERVER_ID,
				bap_uri: bppURI,
				timestamp: ts.toISOString(),
				message_id: uuidv4(),
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
				const response = await axios.post(uri, async, {
					headers: {
						authorization: header,
					},
				});

				log.response = {
					timestamp: new Date().toISOString(),
					response: response.data,
				};

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
				const response = await axios.post(uri, async, {
					headers: {
						authorization: header,
					},
				});

				log.response = {
					timestamp: new Date().toISOString(),
					response: response.data,
				};
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
	}
};

export const sendStatusAxiosCall = async (
	reqContext: object,
	message: object,
	uri: string,
	action: string,
	domain:
		| "b2b"
		| "services"
		| "agri-services"
		| "healthcare-service"
		| "agri-equipment-hiring",
	error?: object | undefined
) => {
	let ts = new Date();
	ts.setSeconds(ts.getSeconds() + 1);

	let async: { message: object; context?: object; error?: object } = {
		context: {},
		message,
	};

	const bppURI =
		domain === "b2b"
			? B2B_BPP_MOCKSERVER_URL
			: domain === "agri-services"
			? AGRI_SERVICES_BPP_MOCKSERVER_URL
			: domain === "healthcare-service"
			? HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
			: domain === "agri-equipment-hiring"
			? AGRI_EQUIPMENT_BPP_MOCKSERVER_URL
			: SERVICES_BPP_MOCKSERVER_URL;

	async = {
		...async,
		context: {
			...reqContext,
			bpp_id: MOCKSERVER_ID,
			bpp_uri: bppURI,
			timestamp: ts.toISOString(),
			action,
		},
	};

	if (error) {
		async = { ...async, error };
	}

	const header = await createAuthHeader(async);

	if (action.startsWith("on_")) {
		var log: TransactionType = {
			request: async,
		};
		try {
			const response = await axios.post(uri, async, {
				headers: {
					authorization: header,
				},
			});
			log.response = {
				timestamp: new Date().toISOString(),
				response: response.data,
			};
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
		}
	}

	logger.info({
		type: "response",
		action: action,
		transaction_id: (reqContext as any).transaction_id,
		message: { sync: { message: { ack: { status: "ACK" } } } },
	});
};

export const quoteCreator = (items: Item[]) => {
	var breakup: any[] = [];
	const chargesOnFulfillment = [
		{
			"@ondc/org/item_id": "F1",
			title: "Delivery charges",
			"@ondc/org/title_type": "delivery",
			price: {
				currency: "INR",
				value: "4000",
			},
		},
		{
			"@ondc/org/item_id": "F1",
			title: "Packing charges",
			"@ondc/org/title_type": "packing",
			price: {
				currency: "INR",
				value: "500",
			},
		},
		{
			"@ondc/org/item_id": "F1",
			title: "Convenience Fee",
			"@ondc/org/title_type": "misc",
			price: {
				currency: "INR",
				value: "100",
			},
		},
	];
	const chargesOnItem = [
		{
			"@ondc/org/item_id": "I1",
			title: "Tax",
			"@ondc/org/title_type": "tax",
			price: {
				currency: "INR",
				value: "0",
			},
		},
		{
			"@ondc/org/item_id": "I1",
			title: "Discount",
			"@ondc/org/title_type": "discount",
			price: {
				currency: "INR",
				value: "-1000",
			},
		},
	];
	items.forEach((item: any) => {
		breakup = [
			...breakup,
			...chargesOnItem,
			{
				"@ondc/org/item_id": item.id,
				"@ondc/org/item_quantity": {
					count: item.quantity.selected.count,
				},
				title: "Product Name Here",
				"@ondc/org/title_type": "item",
				price: {
					currency: "INR",
					value: (item.quantity.selected.count * 250).toString(),
				},
				item: {
					price: {
						currency: "INR",
						value: "250",
					},
				},
			},
		];
		item.fulfillment_ids.forEach((eachId: string) => {
			breakup = [
				...breakup,
				...chargesOnFulfillment.map((each) => ({
					...each,
					"@ondc/org/item_id": eachId,
				})),
			];
		});
	});
	return {
		breakup,
		price: {
			currency: "INR",
			value: (53_600 * items.length).toString(),
		},
		ttl: "P1D",
	};
};

export const quoteCreatorAgriService = (
	items: Item[],
	providersItems?: any
) => {
	//get price from on_search
	items.forEach((item) => {
		// Find the corresponding item in the second array
		if (providersItems) {
			const matchingItem = providersItems.find(
				(secondItem: { id: string }) => secondItem?.id === item?.id
			);
			// If a matching item is found, update the price in the items array
			if (matchingItem) {
				item.title = matchingItem?.descriptor?.name;
				item.price = matchingItem?.price;
				item.tags = matchingItem?.tags;
			}
		}
	});

	let breakup: any[] = [];

	items.forEach((item) => {
		breakup.push({
			title: item.title,
			price: {
				currency: "INR",
				value: (
					Number(item?.price?.value) * item?.quantity?.selected?.count
				).toString(),
			},
			tags: item.tags,
			item:
				item.title === "tax"
					? {
							id: item.id,
					  }
					: {
							id: item.id,
							price: item.price,
							quantity: item.quantity ? item.quantity : undefined,
					  },
		});
	});

	//ADD STATIC TAX IN BREAKUP QUOTE
	breakup.push({
		title: "tax",
		price: {
			currency: "INR",
			value: "10",
		},
		item: items[0],
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "tax",
					},
				],
			},
		],
	});

	breakup?.push({
		title: "pickup_charge",
		price: {
			currency: "INR",
			value: "149",
		},
		item: {
			id: "I1",
		},
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "misc",
					},
				],
			},
		],
	});
	//MAKE DYNAMIC BREACKUP USING THE DYANMIC ITEMS
	let totalPrice = 0;
	breakup.forEach((entry) => {
		const priceValue = parseFloat(entry.price.value);
		if (!isNaN(priceValue)) {
			totalPrice += priceValue;
		}
	});

	const result = {
		breakup,
		price: {
			currency: "INR",
			value: totalPrice.toFixed(2),
		},
		ttl: "P1D",
	};

	return result;
};

export const quoteCreatorHealthCareService = (
	items: Item[],
	providersItems?: any,
	offers?: any,
	fulfillment_type?: string,
	service_name?: string
) => {
	try {
		//GET PACKAGE ITEMS
		//get price from on_search
		items.forEach((item) => {
			if (
				item &&
				item?.tags &&
				item?.tags[0] &&
				item?.tags[0]?.list[0]?.value === "PACKAGE"
			) {
				const getItems = item.tags[0].list[1].value.split(",");
				getItems.forEach((pItem) => {
					// Find the corresponding item in the second array
					if (providersItems) {
						const matchingItem = providersItems?.find(
							(secondItem: { id: string }) => secondItem.id === pItem
						);
						// If a matching item is found, update the price in the items array

						if (matchingItem) {
							items.push({ ...matchingItem, quantity: item?.quantity });
						}
					}
				});
			}
		});

		items.forEach((item) => {
			// Find the corresponding item in the second array
			if (providersItems) {
				const matchingItem = providersItems?.find(
					(secondItem: { id: string }) => secondItem.id === item.id
				);
				// If a matching item is found, update the price in the items array
				if (matchingItem) {
					item.title = matchingItem?.descriptor?.name;
					item.price = matchingItem?.price;
					item.tags = matchingItem?.tags;
				}
			}
		});

		let breakup: any[] = [];

		items.forEach((item) => {
			breakup.push({
				title: item.title,
				price: {
					currency: "INR",
					value: (
						Number(item?.price?.value) * item?.quantity?.selected.count
					).toString(),
				},
				tags: item?.tags,
				item:
					item.title === "tax"
						? {
								id: item?.id,
						  }
						: {
								id: item?.id,
								price: item?.price,
								quantity: item?.quantity ? item?.quantity : undefined,
						  },
			});
		});

		//MAKE DYNAMIC BREACKUP USING THE DYANMIC ITEMS

		//ADD STATIC TAX AND DISCOUNT FOR ITEM ONE
		breakup?.push(
			{
				title: "tax",
				price: {
					currency: "INR",
					value: "10",
				},
				item: items[0],
				tags: [
					{
						descriptor: {
							code: "title",
						},
						list: [
							{
								descriptor: {
									code: "type",
								},
								value: "tax",
							},
						],
					},
				],
			},
			{
				title: "discount",
				price: {
					currency: "INR",
					value: "10",
				},
				item: items[0],
				tags: [
					{
						descriptor: {
							code: "title",
						},
						list: [
							{
								descriptor: {
									code: "type",
								},
								value: "discount",
							},
						],
					},
				],
			}
		);

		if (fulfillment_type === "Seller-Fulfilled") {
			breakup?.push({
				title: "pickup_charge",
				price: {
					currency: "INR",
					value: "149",
				},
				item: items[0],
				tags: [
					{
						descriptor: {
							code: "title",
						},
						list: [
							{
								descriptor: {
									code: "type",
								},
								value: "misc",
							},
						],
					},
				],
			});
		}

		if (service_name === "agri-equipment-hiring") {
			breakup?.push({
				title: "refundable_security",
				price: {
					currency: "INR",
					value: "5000",
				},
				item: items[0],
				tags: [
					{
						descriptor: {
							code: "title",
						},
						list: [
							{
								descriptor: {
									code: "type",
								},
								value: "refundable_security",
							},
						],
					},
				],
			});
		}

		let totalPrice = 0;

		breakup.forEach((entry) => {
			const priceValue = parseFloat(entry?.price?.value);
			if (!isNaN(priceValue)) {
				totalPrice += priceValue;
			}
		});

		const result = {
			breakup,
			price: {
				currency: "INR",
				value: totalPrice.toFixed(2),
			},
			ttl: "P1D",
		};

		return result;
	} catch (error: any) {
		return error;
	}
};

export const quoteCommon = (items: Item[], providersItems?: any) => {
	//get price from on_search
	items.forEach((item) => {
		// Find the corresponding item in the second array
		const matchingItem = providersItems.find(
			(secondItem: { id: string }) => secondItem.id === item.id
		);
		// If a matching item is found, update the price in the items array
		if (matchingItem) {
			item.title = matchingItem?.descriptor?.name;
			item.price = matchingItem?.price;
			item.tags = matchingItem?.tags;
		}
	});

	let breakup: any[] = [];

	items.forEach((item) => {
		breakup.push({
			title: item.title,
			price: {
				currency: "INR",
				value: (
					Number(item.price.value) * item.quantity.selected.count
				).toString(),
			},
			tags: item.tags,
			item: {
				id: item.id,
				price: item.price,
				quantity: item.quantity ? item.quantity : undefined,
			},
		});
	});

	//ADD STATIC TAX IN BREAKUP QUOTE
	breakup.push({
		title: "tax",
		price: {
			currency: "INR",
			value: "10",
		},
		item: items[0],
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "tax",
					},
				],
			},
		],
	});

	//MAKE DYNAMIC BREACKUP USING THE DYANMIC ITEMS

	let totalPrice = 0;

	breakup.forEach((entry) => {
		const priceValue = parseFloat(entry.price.value);
		if (!isNaN(priceValue)) {
			totalPrice += priceValue;
		}
	});

	const result = {
		breakup,
		price: {
			currency: "INR",
			value: totalPrice.toFixed(2),
		},
		ttl: "P1D",
	};

	return result;
};

export const quoteCreatorService = (items: Item[], providersItems?: any) => {
	let result;
	if (providersItems) {
		result = quoteCommon(items, providersItems);
	}
	result?.breakup?.push({
		title: "discount",
		price: {
			currency: "INR",
			value: "0",
		},
		item: {
			id: "I1",
			quantity: {
				allocated: {
					count: "1",
				},
			},
			price: {
				currency: "INR",
				value: "474",
			},
		},
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "discount",
					},
				],
			},
		],
	});
	result?.breakup?.push({
		title: "convenience_fee",
		price: {
			currency: "INR",
			value: "0",
		},
		item: {
			id: "I1",
			quantity: {
				allocated: {
					count: "1",
				},
			},
			price: {
				currency: "INR",
				value: "474",
			},
		},
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "misc",
					},
				],
			},
		],
	});
	return result;
};

export const quoteCreatorServiceCustomized = (
	items: Item[],
	providersItems?: any
) => {
	let result;
	if (providersItems) {
		result = quoteCommon(items, providersItems);
	}
	result?.breakup?.push({
		title: "convenience_fee",
		price: {
			currency: "INR",
			value: "0",
		},
		item: {
			id: "I1",
		},
		tags: [
			{
				descriptor: {
					code: "title",
				},
				list: [
					{
						descriptor: {
							code: "type",
						},
						value: "misc",
					},
				],
			},
		],
	});
	return result;
};

export const checkIfCustomized = (items: Item[]) => {
	return items.some(
		(item) =>
			item.tags &&
			item.tags.some(
				(tag) =>
					tag.list &&
					tag.list.some((subTag) => {
						if (subTag.descriptor.code === "type") {
							return subTag.value === "customization";
						}
					})
			)
	);
};

//Function for check selected items are existed in onsearch or not
export const checkSelectedItems = async (data: any) => {
	try {
		const { message, providersItems } = data;
		const items = message?.order?.items;
		const providersItem = providersItems?.items;
		let matchingItem: any = null;

		items.forEach((item: any) => {
			if (item) {
				const selectedItem = item?.id;
				// Find the corresponding item in the second array
				if (providersItem) {
					matchingItem = providersItem?.find(
						(secondItem: { id: string }) => secondItem.id === selectedItem
					);
				}
			}
		});

		return matchingItem;
	} catch (error) {
		console.log("error occured in matching content");
	}
};

export const updateFulfillments = (
	fulfillments?: any,
	action?: string,
	scenario?: string
) => {
	try {
		// Update fulfillments according to actions

		const rangeStart = new Date().setHours(new Date().getHours() + 2);
		const rangeEnd = new Date().setHours(new Date().getHours() + 3);

		let updatedFulfillments: any = [];

		if (!fulfillments || fulfillments.length === 0) {
			return updatedFulfillments; // Return empty if fulfillments is not provided or empty
		}

		const fulfillmentObj = {
			id: "F1",
			type: FULFILLMENT_TYPES.SELLER_FULFILLED,
			tracking: false,
			state: {
				descriptor: {
					code: FULFILLMENT_STATES.SERVICEABLE,
				},
			},
			stops: fulfillments[0]?.stops.map((ele: any) => {
				ele.time.label = FULFILLMENT_LABELS.CONFIRMED;
				return ele;
			}),
		};

		switch (action) {
			case ON_ACTION_KEY.ON_SELECT:
				// Always push the initial fulfillmentObj
				updatedFulfillments.push(fulfillmentObj);
				if (scenario === SCENARIO.MULTI_COLLECTION) {
					updatedFulfillments.push({
						...fulfillmentObj,
						id: "F2",
					});
				}
				break;
			case ON_ACTION_KEY.ON_CONFIRM:
				updatedFulfillments = fulfillments;
				// Add your logic for ON_CONFIRM
				updatedFulfillments = updatedFulfillments.map((fulfill: any) => {
					(fulfill.state = {
						descriptor: {
							code: FULFILLMENT_STATES.PENDING,
						},
					}),
						fulfill.stops.push({
							type: "start",
							...FULFILLMENT_START,
							time: {
								range: {
									start: new Date(rangeStart).toISOString(),
									end: new Date(rangeEnd).toISOString(),
								},
							},
						}),
						(fulfill.stops = fulfill?.stops?.map((ele: any) => {
							if (ele?.type === "end") {
								ele = {
									...ele,
									...FULFILLMENT_END,
									time: {
										...ele.time,
										label: FULFILLMENT_LABELS.CONFIRMED,
									},
									person:
										ele.customer && ele.customer.person
											? ele.customer.person
											: FULFILLMENT_END.person,
								};
							}
							return ele;
						})),
						(fulfill.rateable = true);
					return fulfill;
				});
				break;
			case ON_ACTION_KEY.ON_CANCEL:
				updatedFulfillments = fulfillments;
				updatedFulfillments = updatedFulfillments.map((fulfillment: any) => ({
					...fulfillment,
					state: {
						...fulfillment.state,
						descriptor: {
							code: FULFILLMENT_STATES.CANCELLED,
						},
					},
					rateable: undefined,
				}));
				break;
			case ON_ACTION_KEY.ON_UPDATE:
				updatedFulfillments = fulfillments;
				updatedFulfillments = updatedFulfillments.map((fulfillment: any) => ({
					...fulfillment,
					state: {
						...fulfillment.state,
						descriptor: {
							code: FULFILLMENT_STATES.COMPLETED,
						},
					},
					rateable: true,
				}));
				break;
			default:
				// Add your default logic if any
				updatedFulfillments = fulfillments;
				break;
		}
		return updatedFulfillments;
	} catch (err) {
		console.log("Error occured in fulfillments method");
	}
};
