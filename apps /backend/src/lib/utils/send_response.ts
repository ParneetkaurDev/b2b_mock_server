//new code (changes in redis with id)

import { NextFunction, Response } from "express";
import axios from "axios";
import { createAuthHeader, redis } from "./index";
import { update } from "lodash";

interface headers {
  authorization: string;
  "X-Gateway-Authorization"?: string;
}

async function send_response(
  res: Response,
  next: NextFunction,
  res_obj: any,
  transaction_id: string,
  action: string,
  scenario: any = "",
  version: any = "",
  bpp_uri: string = "", // for search
  id: number = 0
) {


  let time_now = new Date().toISOString()
  console.log("res_obj",res_obj,"action",action)
  try {
    const { context } = res_obj;
    // context.action=action
    if(bpp_uri === "")
      bpp_uri = context.bpp_uri || res_obj.bpp_uri;

    // res_obj.context.bpp_uri = bpp_uri
    if (res_obj.bpp_uri) delete res_obj.bpp_uri;

    const header = await createAuthHeader(res_obj);
    // res_obj.bpp_uri = bpp_uri
    await redis.set(
      `${transaction_id}-${action}-from-server-${id}-${time_now}`,
      JSON.stringify({ request: { ...res_obj } })
    );

    const headers: headers = {
      authorization: header,
    };

    if (action === "search") {
      headers["X-Gateway-Authorization"] = header;
    }

    let uri: any;
      console.log("scenario",scenario,"version",version)
    if (scenario && version) {
      uri = `${bpp_uri}/${action}${scenario ? `?scenario=${scenario}` : ""}${
        version ? `&version=${version}` : ""
      }`;
    }else if (version){
      uri = `${bpp_uri}/${action}${version ? `?version=${version}` : ""}`;
    }else{
      uri = `${bpp_uri}/${action}${scenario ? `?scenario=${scenario}` : ""}`;

    }

    console.log("uriiiiii",uri,"res_obj",res_obj)
    try{
      const response = await axios.post(uri, res_obj, {
        headers: { ...headers },
      });      
      await redis.set(
        `${transaction_id}-${action}-from-server-${id}-${time_now}`,
        JSON.stringify({
          request: { ...res_obj },
          response: {
            response: response.data,
            timestamp: new Date().toISOString(),
          },
        })
      );
    } catch(err: any) {
      if(err.response.status == 400) {
        res.status(err.response.status).json(err.response.data)
        return;
      }
      throw err
    }
    console.log("Sendresponse aftre")
    return res.status(200).json({
      message: {
        ack: {
          status: "ACK",
        },
      },
      transaction_id,
    });
  } catch (error) {
    next(error);
  }
}

function send_nack(res: Response, message: string) {
  return res.status(400).json({
    message: {
      ack: {
        status: "NACK",
      },
    },
    error: {
      message: message,
    },
  });
}

function send_ack(res: Response) {
  return res.json({
    message: {
      ack: {
        status: "ACK",
      },
    },
  });
}
export { send_response, send_nack, send_ack };