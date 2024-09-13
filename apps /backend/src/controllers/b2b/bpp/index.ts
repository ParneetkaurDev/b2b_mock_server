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
	jsonSchemaValidator({ domain: "b2b", action: "search" }),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "b2b", action: "init" }),
	redisRetriever,
	initController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "b2b", action: "select" }),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "b2b", action: "confirm" }),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "b2b", action: "update" }),
	redisRetriever,
	updateController
);
bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "b2b", action: "status" }),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/cancel",
	jsonSchemaValidator({domain: "b2b", action: "cancel"}),
	redisRetriever,
	cancelController
)