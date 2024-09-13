import { DOMAIN, VERSION, SRV_INTENT_TAGS } from "./constants";

export const searchSchema = {
  $id: "searchSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: DOMAIN
        },
        location: {
          type: "object",
          properties: {
            city: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
          },
          required: ["city", "country"],
        },
        action: {
          type: "string",
          const: "search",
        },
        version: {
          type: "string",
          const: VERSION
        },
        bap_id: {
          type: "string",
        },
        bap_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
        },
        message_id: {
          type: "string",
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          const: "PT30S"
        }
      },
      required: [
        "domain",
        "location",
        "action",
        "version",
        "bap_id",
        "bap_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl"
      ],
    },
    message: {
      type: "object",
      properties: {
        intent: {
          type: "object",
          properties: {
            item: {
              type: "object",
              properties: {
                descriptor: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                  },
                  required: ["name"],
                },
              },
            },
            category: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
            tags: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        enum: SRV_INTENT_TAGS
                      },
                    },
                    required: ["code"],
                  },
                  list: {
                    type: "array",
                    // minItems: 2,
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum:SRV_INTENT_TAGS
                            },
                          },
                          required: ["code"],
                        },
                        value: {
                          type: "string",
                        },
                      },
                      required: ["descriptor", "value"],
                    },
                  },
                },
                required: ["descriptor", "list"],
              },
            },
          },
          required: ["tags"],
        },
      },
      required: ["intent"],
    },
  },
  required: ["context", "message"],
};