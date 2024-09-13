import { Request, Response } from "express";
import { AGRI_EQUIPMENT_SERVICES_SCENARIOS,AGRI_SERVICES_SCENARIOS, B2B_SCENARIOS, B2C_SCENARIOS, HEALTHCARE_SERVICES_SCENARIOS, SERVICES_SCENARIOS, LOGISTICS_SCENARIOS } from "openapi-specs/constants";

export const getAllScenarios = (req: Request, res: Response) => {
  const action = req.params["action"]
  const domain = req.params["domain"]
  let scenarios
  if(domain === "b2b") {
    scenarios = B2B_SCENARIOS[action as keyof typeof B2B_SCENARIOS]
  } else if(domain === "b2c"){
    scenarios = B2C_SCENARIOS[action as keyof typeof B2C_SCENARIOS]
  }
   else if(domain === "services"){
    scenarios = SERVICES_SCENARIOS[action as keyof typeof SERVICES_SCENARIOS]
  }else if(domain === "healthcare-services"){
    scenarios = HEALTHCARE_SERVICES_SCENARIOS[action as keyof typeof HEALTHCARE_SERVICES_SCENARIOS]
  }else if(domain === "agri-equipment-hiring"){
    scenarios =AGRI_EQUIPMENT_SERVICES_SCENARIOS[action as keyof typeof AGRI_EQUIPMENT_SERVICES_SCENARIOS]
  }else if(domain === "logistics"){
    scenarios = LOGISTICS_SCENARIOS[action as keyof typeof LOGISTICS_SCENARIOS]
  }
  else{
    scenarios = AGRI_SERVICES_SCENARIOS[action as keyof typeof AGRI_SERVICES_SCENARIOS]
  }
  return res.json({scenarios})
}