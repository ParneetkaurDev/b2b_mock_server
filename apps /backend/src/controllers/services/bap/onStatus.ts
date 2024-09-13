import { Request, Response } from "express";

export const onStatusController = (req: Request, res: Response) => {
	console.log("OnstatusCOntroller BAp")
	return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
	});
};
