import { DOMAIN, VERSION } from "./constants";

export const updateSchema = {
	$id: "updateSchema",
	type: "object",
	properties: {
		context: {
			type: "object",
			properties: {
				domain: {
					type: "string",
					enum: DOMAIN,
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
					const: "update",
				},
				version: {
					type: "string",
					const: VERSION,
				},
				bap_id: {
					type: "string",
				},
				bap_uri: {
					type: "string",
				},
				bpp_id: {
					type: "string",
				},
				bpp_uri: {
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
					const: "PT30S",
				},
			},
			required: [
				"domain",
				"location",
				"action",
				"version",
				"bap_id",
				"bap_uri",
				"bpp_id",
				"bpp_uri",
				"transaction_id",
				"message_id",
				"timestamp",
				"ttl",
			],
		},
		message: {
			type: "object",
			properties: {
				update_target: {
					type: "string",
					enum: ["fulfillment", "item", "payments"],
				},
				order: {
					type: "object",
					properties: {
						id: {
							type: "string",
						},
						state: {
							type: "string",
						},
						provider: {
							type: "object",
							properties: {
								id: {
									type: "string",
								},
							},
							required: ["id"],
						},
						items: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									quantity: {
										type: "object",
										properties: {
											selected: {
												type: "object",
												properties: {
													count: {
														type: "integer",
													},
												},
												required: ["count"],
											},
										},
										required: ["selected"],
									},
								},
								required: ["id", "quantity"],
							},
						},
						payments: {
							type: "array",
							items: {
								type: "object",
								properties: {
									uri: {
										type: "string",
									},
									tl_method: {
										type: "string",
									},
									params: {
										type: "object",
										properties: {
											currency: {
												type: "string",
											},
											transaction_id: {
												type: "string",
											},
											amount: {
												type: "string",
											},
										},
										required: ["currency", "amount"],
									},
									status: {
										type: "string",
										enum: ["PAID", "NOT-PAID"],
									},
									type: {
										type: "string",
										enum: [
											"PRE-FULFILLMENT",
											"ON-FULFILLMENT",
											"POST-FULFILLMENT",
										],
									},
									collected_by: {
										type: "string",
									},
									"@ondc/org/buyer_app_finder_fee_type": {
										type: "string",
									},
									"@ondc/org/buyer_app_finder_fee_amount": {
										type: "string",
									},
									"@ondc/org/settlement_details": {
										type: "array",
										items: {
											type: "object",
											properties: {
												settlement_counterparty: {
													type: "string",
												},
												settlement_phase: {
													type: "string",
												},
												settlement_type: {
													type: "string",
												},
												upi_address: {
													type: "string",
												},
												settlement_bank_account_no: {
													type: "string",
												},
												settlement_ifsc_code: {
													type: "string",
												},
												beneficiary_name: {
													type: "string",
												},
												bank_name: {
													type: "string",
												},
												branch_name: {
													type: "string",
												},
											},
											allOf: [
												{
													if: {
														properties: {
															settlement_type: {
																const: "upi",
															},
														},
													},
													then: {
														required: ["upi_address"],
													},
												},
												{
													if: {
														properties: {
															settlement_type: {
																const: ["neft", "rtgs"],
															},
														},
													},
													then: {
														required: [
															"settlement_ifsc_code",
															"settlement_bank_account_no",
														],
													},
												},
											],
											required: ["settlement_counterparty", "settlement_type"],
										},
									},
								},
								required: [
									"uri",
									"tl_method",
									"params",
									"status",
									"type",
									"collected_by",
									"@ondc/org/buyer_app_finder_fee_type",
									"@ondc/org/buyer_app_finder_fee_amount",
								],
							},
						},
					},
					additionalProperties: false,
					required: ["id", "state", "provider", "items", "payments"],
				},
			},
			required: ["update_target", "order"],
		},
	},
	required: ["context", "message"],
};
