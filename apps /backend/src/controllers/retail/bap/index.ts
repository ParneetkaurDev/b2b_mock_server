import { Router } from "express";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";
import { onCancelController } from "./onCancel";

export const bapRouter = Router();

bapRouter.post(
	"/on_search",
	jsonSchemaValidator({ domain: "retail", action: "on_search" }),
	redisRetriever,
	onSearchController
);

bapRouter.post(
	"/on_init",
	jsonSchemaValidator({ domain: "retail", action: "on_init" }),
	redisRetriever,
	onInitController
);
bapRouter.post(
	"/on_select",
	jsonSchemaValidator({ domain: "retail", action: "on_select" }),
	redisRetriever,
	onSelectController
);

bapRouter.post(
	"/on_confirm",
	jsonSchemaValidator({ domain: "retail", action: "on_confirm" }),
	redisRetriever,
	onConfirmController
);

bapRouter.post(
	"/on_status",
	jsonSchemaValidator({ domain: "retail", action: "on_status" }),
	redisRetriever,
	onStatusController
);

bapRouter.post(
	"/on_update",
	jsonSchemaValidator({ domain: "retail", action: "on_update" }),
	redisRetriever,
	onUpdateController
);


bapRouter.post(
	"/on_cancel",
	jsonSchemaValidator({ domain: "retail", action: "on_cancel" }),
	redisRetriever,
	onCancelController
)