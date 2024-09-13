import { Router } from "express";
import { searchController } from "./search";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { cancelController } from "./cancel";

export const bppRouter = Router();

bppRouter.post(
	"/search",
	jsonSchemaValidator({ domain: "retail", action: "search" }),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "retail", action: "init" }),
	redisRetriever,
	initController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "retail", action: "select" }),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "retail", action: "confirm" }),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "retail", action: "update" }),
	redisRetriever,
	updateController
);

bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "retail", action: "status" }),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/cancel",
	jsonSchemaValidator({domain: "retail", action: "cancel"}),
	redisRetriever,
	cancelController
)