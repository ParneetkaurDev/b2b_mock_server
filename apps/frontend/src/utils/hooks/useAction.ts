import * as _ from "lodash";
import { useState } from "react";
import {
	B2B_SCENARIOS,
	SERVICES_SCENARIOS,
	NEXT_ACTION,
	HEALTHCARE_SERVICES_SCENARIOS,
	AGRI_SERVICES_SCENARIOS,
	EQUIPMENT_HIRING_SERVICES_SCENARIOS,
} from "openapi-specs/constants";
import { ALL_DOMAINS_FRONTEND } from "../constants";

export const useAction = () => {
	const [action, setAction] = useState<string>();
	const [domain, setDomain] = useState<string>("b2b");
	const [logError, setLogError] = useState(false);

	const [scenarios, setScenarios] =
		useState<{ name: string; scenario?: string }[]>();

	const detectAction = _.debounce((log: string) => {
		try {
			const parsedLog = JSON.parse(log);
			const newDomain =
				parsedLog?.context?.domain === ALL_DOMAINS_FRONTEND.SERVICES_DOMAINS
					? "services"
					: parsedLog?.context?.domain ===
					  ALL_DOMAINS_FRONTEND.HEALTHCARE_SERVICES_DOMAINS
					? "healthcare-services"
					: parsedLog?.context?.domain ===
					  ALL_DOMAINS_FRONTEND.AGRI_SERVICES_DOMAINS
					? "agri-services"
					: parsedLog?.context?.domain ===
					  ALL_DOMAINS_FRONTEND.EUIPMENT_HIRING_SERVICES_DOMAINS
					? "agri-equipment-hiring"
					: "b2b";

			setDomain(newDomain);

			//DETACT DOMAIN
			const allScenarios =
				domain === "b2b"
					? B2B_SCENARIOS
					: domain === "services"
					? SERVICES_SCENARIOS
					: domain === "healthcare-services"
					? HEALTHCARE_SERVICES_SCENARIOS
					: domain === "agri-equipment-hiring"
					? EQUIPMENT_HIRING_SERVICES_SCENARIOS
					: AGRI_SERVICES_SCENARIOS;

			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action;
			setAction(parsedAction);
			const scenarioKey = Object.keys(allScenarios).filter(
				(key) => key === NEXT_ACTION[parsedAction as keyof typeof NEXT_ACTION]
			)[0];
			if (scenarioKey) {
				setScenarios(allScenarios[scenarioKey as keyof typeof allScenarios]);
			} else {
				setScenarios([]);
			}
			setLogError(false);
		} catch (error) {
			// console.log("Error Occurred in LOG", error);
			setLogError(true);
			setAction(undefined);
		}
	}, 1500);
	return { action, domain, logError, scenarios, detectAction };
};
