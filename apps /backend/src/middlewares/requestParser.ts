import { NextFunction, Request, Response } from "express";

export const requestParser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body) next();
	try {
		if (req.headers["content-type"] === "application/json") {
			(req as any).rawBody = JSON.stringify(req.body);
			// req.body is already parsed, no need to parse it again
		}
	} catch (error) {
		if (error instanceof SyntaxError)
			return res.status(400).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					type: "JSON-SCHEMA-ERROR",
					code: "50009",
					message: error.message,
				},
			});
	}
	next();
};
