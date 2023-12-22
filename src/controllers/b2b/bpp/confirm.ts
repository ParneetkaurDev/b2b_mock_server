import { Request, Response } from "express";
import { onConfirmDomestic } from "../../../lib/examples";

export const confirmController = (req: Request, res: Response) => {
	const domain = req.body.context.domain;
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
	const context = {
		...req.body.context,
		action: "on_confirm",
		bpp_id: "b2b.ondc-mockserver.com",
		bpp_uri: "b2b.ondc-mockserver.com/url",
		timeStamp: ts.toISOString(),
	};
	return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
		async: {
			context,
			message: onConfirmDomestic.message,
		},
	});
};
