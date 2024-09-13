import { Router } from "express";
import { searchController } from "./search";
import { initController } from "./init";
import { confirmController } from "./confirm";
import { updateController } from "./update";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { statusController } from "./status";
import { cancelController } from "./cancel";

export const bppRouter = Router();

bppRouter.post(
  "/search",
  jsonSchemaValidator({ domain: "logistics", action: "search" }),
  redisRetriever,
  searchController
);

bppRouter.post(
  "/init", 
  jsonSchemaValidator({ domain: "logistics", action: "init" }),
  redisRetriever,
  initController
);

bppRouter.post(
  "/confirm", 
  jsonSchemaValidator({ domain: "logistics", action: "confirm" }),
  redisRetriever,
  confirmController
);

bppRouter.post(
  "/update",
  jsonSchemaValidator({ domain: "logistics", action: "update" }),
  redisRetriever,
  updateController
);

bppRouter.post(
  "/status",
  jsonSchemaValidator({ domain: "logistics", action: "status" }),
  redisRetriever,
  statusController
);

bppRouter.post(
  "/cancel",
  jsonSchemaValidator({ domain: "logistics", action: "cancel" }),
  redisRetriever,
  cancelController
);