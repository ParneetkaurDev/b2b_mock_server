import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import { subscriptionSchemaValidator } from "../lib/schema/subscription";
import { logisticsSchemaValidator } from "../lib/schema/logistics";
import { b2cSchemaValidator } from "../lib/schema/b2c";
import { retailSchemaValidator } from "../lib/schema/retail";

type AllActions =
	| "search"
	| "on_search"
	| "select"
	| "on_select"
	| "init"
	| "on_init"
	| "confirm"
	| "on_confirm"
	| "status"
	| "on_status"
	| "update"
	| "on_update"
	| "track"
	| "on_track"
	| "cancel"
	| "on_cancel"
	| "rating";

type LogisticsActions = Exclude<AllActions, "select" | "on_select" | "rating">;

type B2BActions = Exclude<AllActions, "rating">;
type B2CActions = Exclude<AllActions, "rating">;



type Domain =
	| "b2b"
	| "b2c"
	| "services"
	| "logistics"
	| "retail"
	| "subscription";

type ActionType<T extends Domain> = T extends "logistics"
	? LogisticsActions
	:AllActions;

type JsonSchemaValidatorType<T extends Domain> = {
	domain: T;
	action: ActionType<T>;
};

export const jsonSchemaValidator = <T extends Domain>({
	domain,
	action,
}: JsonSchemaValidatorType<T>) => {
	switch (domain) {
		case "b2b":
			return b2bSchemaValidator(action as AllActions);
		case "b2c":
			return b2cSchemaValidator(action as AllActions);
		case "services":
			return srvSchemaValidator(action as AllActions);
		case "retail":
			return retailSchemaValidator(action as AllActions);
		case "subscription":
			return subscriptionSchemaValidator(action as AllActions);
		case "logistics":
			return logisticsSchemaValidator(action as LogisticsActions);
		default:
			throw new Error(`Unsupported domain: ${domain}`);
	}
};
