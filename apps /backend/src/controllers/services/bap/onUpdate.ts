import { Request, Response } from "express";

export const onUpdateController = (req: Request, res: Response) => {
	console.log("onUPdate")
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
