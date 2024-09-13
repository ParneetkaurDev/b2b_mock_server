import { Router } from "express";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onConfirmController } from "./onConfirm";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { onCancelController } from "./onCancel";
import { onUpdateController } from "./onUpdate";
import { onStatusController } from "./onStatus";

export const bapRouter = Router();

bapRouter.post(
	"/on_search",
	jsonSchemaValidator({ domain: "logistics", action: "on_search" }),
	redisRetriever,
	onSearchController
);

bapRouter.post(
	"/on_init",
	jsonSchemaValidator({ domain: "logistics", action: "on_init" }),
	redisRetriever,
	onInitController
);

bapRouter.post(
	"/on_confirm",
	jsonSchemaValidator({ domain: "logistics", action: "on_confirm" }),
	redisRetriever,
	onConfirmController
);

bapRouter.post(
	"/on_cancel",
	jsonSchemaValidator({ domain: "logistics", action: "on_cancel" }),
	redisRetriever,
	onCancelController
);

bapRouter.post(
	"/on_update",
	jsonSchemaValidator({ domain: "logistics", action: "on_update" }),
	redisRetriever,
	onUpdateController
);

bapRouter.post(
	"/on_status",
	jsonSchemaValidator({ domain: "logistics", action: "on_status" }),
	redisRetriever,
	onStatusController
);
