import {  Request, Response } from "express";
import { redis } from "../../lib/utils";

export const getAllTransactionIdController = async (
	_req: Request,
	res: Response
) => {
	const ids = await redis.keys("*");
	return res.json(ids)
};
