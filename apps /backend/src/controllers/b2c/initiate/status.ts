import { NextFunction, Request, Response } from "express";
import {
	B2C_BAP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redis,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import { B2C_STATUS } from "../../../lib/utils/apiConstants";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initiateStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { scenario, transactionId } = req.body;

		const transactionKeys = await redis.keys(`${transactionId}-*`);
		const ifTransactionExist = transactionKeys.filter((e) =>
			e.includes("on_confirm-to-server")
		);

		if (ifTransactionExist.length === 0) {
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}
		const statusIndex = transactionKeys.filter((e) =>
			e.includes("-status-to-server")
		).length;

		const transaction = await redis.mget(ifTransactionExist);
		const parsedTransaction = transaction.map((ele) => {
			return JSON.parse(ele as string);
		});

		// console.log("parsedTransaction:::: ", parsedTransaction[0]);
		return intializeRequest(
			res,
			next,
			parsedTransaction[0].request,
			statusIndex
		);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	statusIndex: number
) => {
	try {
		const {
			context,
			message: {
				order: { provider, provider_location, ...order },
			},
		} = transaction;
		const { transaction_id } = context;

		const status = {
			context: {
				...context,
				message_id: uuidv4(),
				timestamp: new Date().toISOString(),
				action: "status",
				bap_id: MOCKSERVER_ID,
				bap_uri: B2C_BAP_MOCKSERVER_URL,
			},
			message: {
				order_id: order.id,
			},
		};
		const senarios = B2C_STATUS;
		// satus index is always witin boundary of senarios array
		statusIndex = Math.min(Math.max(statusIndex, 0), senarios.length - 1);

		await send_response(
			res,
			next,
			status,
			transaction_id,
			"status",
			senarios[statusIndex]
		);
	} catch (error) {
		next(error);
	}
};
