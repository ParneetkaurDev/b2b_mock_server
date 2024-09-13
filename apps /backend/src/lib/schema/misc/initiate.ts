export const initiateB2BTransactionSchema = {
	$id: "initiateTransaction",
	type: "object",
	properties: {
		bpp_uri: {
			type: "string",
		},
		city: {
			type: "object",
			properties: {
				code: {
					type: "string",
					enum: ["std:080", "std:011"],
				},
			},
		},
		domain: {
			type: "string",
			enum: [
				"ONDC:RET1A",
				"ONDC:RET1B",
				"ONDC:RET1C",
				"ONDC:RET1D",
				"ONDC:RET10",
				"ONDC:RET12",
				"ONDC:RET13",
				"ONDC:RET14",
			],
		},
	},
};
export const initiateServicesTransactionSchema = {
	$id: "initiateTransaction",
	type: "object",
	properties: {
		bpp_uri: {
			type: "string",
		},
		city: {
			type: "object",
			properties: {
				code: {
					type: "string",
					enum: ["std:080", "std:011"],
				},
			},
		},
		domain: {
			type: "string",
			enum: [
				"ONDC:SRV11",
			],
		},
	},
};
