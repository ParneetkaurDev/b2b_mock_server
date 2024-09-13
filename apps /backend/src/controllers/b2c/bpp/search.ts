import { NextFunction, Request, Response } from "express";

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { B2C_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import axios from "axios";

export const searchController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("versionnnn",req.body.version);
    const domain = req.body.context.domain;

    var onSearch;
    switch (domain) {
      case "ONDC:RET12":
        var file = fs.readFileSync(
          path.join(B2C_EXAMPLES_PATH, "on_search/on_search_fashion.yaml")
        );
        onSearch = YAML.parse(file.toString());
        break;
      case "ONDC:RET10":
        var file = fs.readFileSync(
          path.join(B2C_EXAMPLES_PATH, "on_search/on_search_grocery.yaml")
        );
        onSearch = YAML.parse(file.toString());
        break;
      default:
        var file = fs.readFileSync(
          path.join(B2C_EXAMPLES_PATH, "on_search/on_search_fashion.yaml")
        );
        onSearch = YAML.parse(file.toString());
        break;
    }

    return responseBuilder(
      res,
      next,
      req.body.context,
      onSearch.value.message,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
      }`,
      `on_search`,
      "b2c"
    );
  } catch (error) {
    return next(error);
  }
};
