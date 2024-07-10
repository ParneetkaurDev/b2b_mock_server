import { Request, Response } from "express";
import { AGRI_SERVICES_SCENARIOS, B2B_SCENARIOS, EQUIPMENT_HIRING_SERVICES_SCENARIOS, HEALTHCARE_SERVICES_SCENARIOS, SERVICES_SCENARIOS } from "openapi-specs/constants";

export const getAllScenarios = (req: Request, res: Response) => {
  const action = req.params["action"]
  const domain = req.params["domain"]
  let scenarios
  if(domain === "b2b") {
    scenarios = B2B_SCENARIOS[action as keyof typeof B2B_SCENARIOS]
  } else if(domain === "services"){
    scenarios = SERVICES_SCENARIOS[action as keyof typeof SERVICES_SCENARIOS]
  }else if(domain === "healthcare-services"){
    scenarios = HEALTHCARE_SERVICES_SCENARIOS[action as keyof typeof HEALTHCARE_SERVICES_SCENARIOS]
  }else if(domain === "agri-equipment-hiring"){
    scenarios = EQUIPMENT_HIRING_SERVICES_SCENARIOS[action as keyof typeof EQUIPMENT_HIRING_SERVICES_SCENARIOS]
  }
  else{
    scenarios = AGRI_SERVICES_SCENARIOS[action as keyof typeof AGRI_SERVICES_SCENARIOS]
  }
  return res.json({scenarios})
}