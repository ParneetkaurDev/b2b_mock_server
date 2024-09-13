import { NetworkPaticipantType } from "./LocalRequest";

export type LookupParameter = {
  subscriber_id?: String,
  unique_key_id?: String,
  type?: NetworkPaticipantType,
  domain?: String,
}