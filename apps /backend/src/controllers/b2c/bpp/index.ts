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
	jsonSchemaValidator({ domain: "b2c", action: "search" }),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "b2c", action: "init" }),
	redisRetriever,
	initController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "b2c", action: "select" }),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "b2c", action: "confirm" }),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "b2c", action: "update" }),
	redisRetriever,
	updateController
);
bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "b2c", action: "status" }),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/cancel",
	jsonSchemaValidator({domain: "b2c", action: "cancel"}),
	redisRetriever,
	cancelController
)