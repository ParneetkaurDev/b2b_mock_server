export const masterSchema = {
  $id: "masterSchema",
  type: "object",
  properties: {
    search: {
      type: "object",
      properties: {
        $ref: "searchSchema#properties",
      },
    },
    on_search: {
      type: "object",
      properties: {
        $ref: "onSearchSchema#properties",
      },
    },
    select: {
      type: "object",
      properties: {
        $ref: "selectSchema#properties",
      },
    },
    on_select: {
      type: "object",
      properties: {
        $ref: "onSelectSchema#properties",
      },
    },
    init: {
      type: "object",
      properties: {
        $ref: "initSchema#properties",
      },
    },
    on_init: {
      type: "object",
      properties: {
        $ref: "onInitSchema#properties",
      },
    },
    confirm: {
      type: "object",
      properties: {
        $ref: "confirmSchema#properties",
      },
    },
    on_confirm: {
      type: "object",
      properties: {
        $ref: "onConfirmSchema#properties",
      },
    },
    update: {
      type: "object",
      properties: {
        $ref: "updateSchema#properties",
      },
    },
    on_update: {
      type: "object",
      properties: {
        $ref: "onUpdateSchema#properties",
      },
    },
    status: {
      type: "object",
      properties: {
        $ref: "statusSchema#properties",
      },
    },
    on_status: {
      type: "object",
      properties: {
        $ref: "onStatusSchema#properties",
      },
    },
    cancel: {
      type: "object",
      properties: {
        $ref: "cancelSchema#properties",
      },
    },
    on_cancel: {
      type: "object",
      properties: {
        $ref: "onCancelSchema#properties",
      },
    }
  },
};