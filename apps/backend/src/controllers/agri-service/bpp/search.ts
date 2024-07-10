import { NextFunction, Request, Response } from "express";
import { AGRI_SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const searchController = (req: Request, res: Response, next: NextFunction) => {
  try{
    const file = fs.readFileSync(
      path.join(
        AGRI_SERVICES_EXAMPLES_PATH,
        `on_search/${
          req.body.message?.intent?.item?.category?.id === "SRV14:1004" || req.body.message?.intent?.item?.descriptor?.name !== "Soil Testing" ? "on_search_assaying.yaml":"on_search.yaml"
        }`
      )
    ); 
    const response = YAML.parse(file.toString());   
    
    return responseBuilder(
      res,
      next,
      req.body.context,
      response.value.message,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_SEARCH : `/${ON_ACTION_KEY.ON_SEARCH}`
      }`,
      `${ON_ACTION_KEY.ON_SEARCH}`,
      "agri-services"
    );
  }catch(error){
    return next(error)
  }
};
