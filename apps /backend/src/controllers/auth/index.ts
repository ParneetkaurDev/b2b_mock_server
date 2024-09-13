import { Request, Response, Router } from "express";
import { authValidatorMiddleware } from "../../middlewares";
import { createSigningString, signMessage } from "../../lib/utils";

export const authRouter = Router();

authRouter.post(
	"/signCheck",
	authValidatorMiddleware,
	(_req: Request, res: Response) => {
		return res.json({
			message: "Valid Signature",
		});
	}
);

authRouter.post("/signature", async (req: Request, res: Response) => {
	const { private_key, subscriber_id, unique_key_id, request } = req.body;
	const { signing_string, expires, created } = await createSigningString(
		JSON.stringify(request)
	);
	const signature = await signMessage(signing_string, private_key || "");
	const auth_header = `Signature keyId="${subscriber_id}|${unique_key_id}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
	return res.send(auth_header);
});
