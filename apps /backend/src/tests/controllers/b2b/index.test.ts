import app from "../../../index";
import request from "supertest";
import YAML from "yaml";
import path from "path";
import fs from "fs";
import {
	B2B_BAP_MOCKSERVER_URL,
	B2B_EXAMPLES_PATH,
	createAuthHeader,
	MOCKSERVER_ID,
} from "../../../lib/utils";
import searchByCategory from "../../../../domain-repos/@retail-b2b/release-2.0.2/api/components/Examples/B2B_json/search/search_by_category.json";
import selectDomestic from "../../../../domain-repos/@retail-b2b/release-2.0.2/api/components/Examples/B2B_json/select/select_domestic.json";
import { ErrorResponse, logSchemaError, runAssertion } from "../../lib/utils";

const SERVER_URI = `http://localhost:3000`;

describe("B2B Tests", () => {
	it("Should pass auth test", async () => {
		const REQ_BODY = searchByCategory;
		REQ_BODY.context.bap_id = MOCKSERVER_ID;
		REQ_BODY.context.bap_uri = B2B_BAP_MOCKSERVER_URL;
		const header = await createAuthHeader(REQ_BODY);
		// console.log("HEADER", header);
		// console.log("REQ Body", REQ_BODY);
		const res = await request(app)
			.post("/auth/signCheck")
			.send(REQ_BODY)
			.set({ authorization: header });
		expect(res.body.message).toBe("Valid Signature");
	});
	const fileLocations = [
		"search/search_by_category.yaml",
		"on_search/on_search_grocery.yaml",
		"select/select_domestic/yaml",
		"on_select/on_select_domestic.yaml",
		"init/init_domestic.yaml",
		"on_init/on_init_domestic.yaml",
		"confirm/confirm_domestic.yaml",
		"on_confirm/on_confirm_domestic.yaml",
	];
	const files = fileLocations.map(
		(eachFile) =>
			YAML.parse(
				fs
					.readFileSync(
						path.join(B2B_EXAMPLES_PATH, "on_search/on_search_grocery.yaml")
					)
					.toString()
			).value
	);

	const cases = [
		["search-on_search", [0, 1]],
		["on_search-select", [1, 2]],
		["select-on_select", [2, 3]],
		["init-on_init", [3, 4]],
		["confirm-on_confirm", [4, 5]],
	];

	test.each(cases)(
		"Testing %s interaction",
		async (name: any, fileIndices: any) => {
			const reqBody = files[fileIndices[0]];
			const pair = name.split("-");
			if (pair[0].startsWith("on_")) {
				reqBody.context = {
					...reqBody.context,
					bpp_id: MOCKSERVER_ID,
					bpp_uri: SERVER_URI,
				};
			} else {
				reqBody.context = {
					...reqBody.context,
					bap_id: MOCKSERVER_ID,
					bap_uri: SERVER_URI,
				};
			}
			const header = await createAuthHeader(reqBody);
			const url = `/b2b/${pair[0].startsWith("on_") ? "bap" : "bpp"}/${
				pair[0]
			}`;
			const res = await request(app)
				.post(url)
				.send(reqBody)
				.set({ authorization: header })
				.query({ mode: "mock" });
			console.log("RESPONSE :", res.body);
			runAssertion(
				() => {
					expect(res.body.sync.message).toEqual({ ack: { status: "ACK" } });
				},
				() => logSchemaError(res.body as ErrorResponse, path.join( __dirname,"../../logs/", name))
			);
		}
	);
	// it("Should respond with ACK on /search", async () => {
	// 	const reqBody = searchByCategory;
	// 	reqBody.context = {
	// 		...reqBody.context,
	// 		bap_id: MOCKSERVER_ID,
	// 		bap_uri: `http://localhost:3000`,
	// 	};
	// 	const header = await createAuthHeader(reqBody);
	// 	const res = await request(app)
	// 		.post("/b2b/bpp/search")
	// 		.send(reqBody)
	// 		.set({ authorization: header })
	// 		.query({
	// 			mode: "mock",
	// 		});
	// 	expect(res.body.message).toEqual({ ack: { status: "ACK" } });
	// });

	// it("Should respond with ACK on /select", async () => {
	// 	const reqBody = selectDomestic;
	// 	reqBody.context = {
	// 		...reqBody.context,
	// 		bap_id: MOCKSERVER_ID,
	// 		bap_uri: B2B_BAP_MOCKSERVER_URL,
	// 	};
	// 	const header = await createAuthHeader(reqBody);
	// 	const res = await request(app)
	// 		.post("/b2b/bpp/select")
	// 		.send(reqBody)
	// 		.set({ authorization: header });
	// 	console.log("Response", res.body);
	// 	expect(res.body.message).toEqual({ ack: { status: "ACK" } });
	// });
});
