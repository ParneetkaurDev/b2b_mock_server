import { NextFunction, Request, Response } from "express";
import { responseBuilder, updateFulfillments } from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ORDER_STATUS } from "../../../lib/utils/apiConstants";


export const confirmController = (req: Request, res: Response, next: NextFunction) => {
	try{
		confirmConsultationController(req, res, next);
	}catch(error){
		return next(error)
	}
};


export const confirmConsultationController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { context, message: { order } } = req.body;
		const { fulfillments } = order
		const updatedFulfillments = updateFulfillments(fulfillments, ON_ACTION_KEY?.ON_CONFIRM);

		const responseMessage = {
			order: {
				...order,
				status: ORDER_STATUS.ACCEPTED,
				fulfillments:updatedFulfillments,
				provider: {
					...order.provider,
					rateable: true
				}
			}
		}
		
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_CONFIRM : `/${ON_ACTION_KEY.ON_CONFIRM }`
			}`,
			`${ON_ACTION_KEY.ON_CONFIRM}`,
			"agri-services"
		);
	}catch(error){
		next(error)
	}
};



