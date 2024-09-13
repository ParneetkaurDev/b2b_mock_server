import fs from "fs";
import path from "path";

export type ErrorResponse = {
	message: { ack: { status: string } };
	error: {
		type: string;
		code: string;
		message: [[Object], [Object]];
	};
};
export function logSchemaError(response: ErrorResponse, filename: string) {
	if (!fs.existsSync(path.dirname(filename))) {
		fs.mkdirSync(path.dirname(filename));
	}
	if (response.error) {
		fs.writeFileSync(
			`${filename}-${response.error.type}.txt`,
			JSON.stringify(response.error.message, undefined, 2)
		);
	}
}
