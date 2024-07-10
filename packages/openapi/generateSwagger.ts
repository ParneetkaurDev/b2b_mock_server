import jsYaml from "js-yaml";
import fs from "fs";
import $RefParser, {
	RefParserSchema,
} from "@apidevtools/json-schema-ref-parser";
import { execSync } from "child_process";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
import {
	NEXT_ACTION,
	B2B_SCENARIOS,
	SERVICES_SCENARIOS,
	HEALTHCARE_SERVICES_SCENARIOS,
	DOMAINS,
	AGRI_SERVICES_SCENARIOS,
	EQUIPMENT_HIRING_SERVICES_SCENARIOS
} from "./constants";

const swaggerParse = async (swaggerPath: string) => {
	const file = fs.readFileSync(swaggerPath, "utf8");
	const swaggerDocument = jsYaml.load(file);
	try {
		// console.log("Swagger Doc", swaggerDocument);
		let schema = await $RefParser.dereference(
			swaggerDocument as RefParserSchema
		);
		// console.log("SCHEMA", schema);
		return schema;
	} catch (err) {
		console.error(err);
	}
};

const generateSwagger = async (
	inputPath: string,
	outputPath: string,
	scenarios: typeof B2B_SCENARIOS | typeof SERVICES_SCENARIOS | typeof HEALTHCARE_SERVICES_SCENARIOS | typeof AGRI_SERVICES_SCENARIOS | typeof EQUIPMENT_HIRING_SERVICES_SCENARIOS,
	servers: { url: string; description: string }[]
) => {
	const schema: any = await swaggerParse(inputPath);
	schema.externalDocs = {
		description: "User guide",
		url: "https://github.com/tanyamadaan/b2b_mock_server/blob/feat-monorepo/README.md",
	};

	schema["info"]["title"] =
		schema["x-examples"][Object.keys(schema["x-examples"])[0]]["summary"];
	schema["info"]["description"] =
		schema["x-examples"][Object.keys(schema["x-examples"])[0]]["description"];

	if (servers.length > 0) {
		schema.servers = servers;
	}
	for (const i of Object.keys(schema.paths)) {
		const key = i.replace("/", "");
		schema.paths[i].post.parameters = [
			{
				in: "query",
				name: "mode",
				required: true,
				schema: {
					type: "string",
					enum: ["sandbox", "mock"],
				},
			},
		];

		if (
			scenarios[
				NEXT_ACTION[key as keyof typeof NEXT_ACTION] as keyof typeof scenarios
			]
		) {
			schema.paths[i].post.parameters.push({
				in: "query",
				name: "scenario",
				required: true,
				schema: {
					type: "string",
					enum: scenarios[
						NEXT_ACTION[
							key as keyof typeof NEXT_ACTION
						] as keyof typeof scenarios
					].map((scenario: any)=> {
						return scenario;
					}),
				},
			});
		}
		if (schema["x-examples"].hasOwnProperty(DOMAINS.b2b)) {
			if (schema["x-examples"][DOMAINS.b2b].example_set[key]) {
				schema.paths[i].post.requestBody.content["application/json"].examples =
					{};
				schema["x-examples"][DOMAINS.b2b].example_set[key].examples.forEach(
					(example: { summary: string | number; value: any }) => {
						schema.paths[i].post.requestBody.content[
							"application/json"
						].examples[example.summary] = {
							value: example.value,
						};
					}
				);
			}
		} else if (schema["x-examples"].hasOwnProperty(DOMAINS.services)) {
			if (schema["x-examples"][DOMAINS.services].example_set[key]) {
				schema.paths[i].post.requestBody.content["application/json"].examples =
					{};
				schema["x-examples"][DOMAINS.services].example_set[
					key
				].examples.forEach(
					(example: { summary: string | number; value: any }) => {
						schema.paths[i].post.requestBody.content[
							"application/json"
						].examples[example.summary] = {
							value: example.value,
						};
					}
				);
			}
		}
	}
	const build = jsYaml.dump(schema);
	fs.writeFileSync(path.join(outputPath, "openapi-temp.yaml"), build, "utf8");
	const command = `npx swagger-cli bundle ${path.join(
		outputPath,
		"openapi-temp.yaml"
	)} --outfile ${path.join(outputPath, "build", "swagger.json")} -t json`;
	execSync(command, { stdio: "inherit" });
	fs.unlinkSync(path.join(outputPath, "openapi-temp.yaml"));
};

generateSwagger(
	"./domain-repos/@retail-b2b/release-2.0.2/api/build/build.yaml",
	"./openapi/retail-b2b",
	B2B_SCENARIOS,
	[
		{
			url: `${process.env.SERVER_LINK}/b2b/bpp`,
			description: "Sandbox as seller ",
		},
		{
			url: `${process.env.SERVER_LINK}/b2b/bap`,
			description: "Sandbox as buyer",
		},
	]
);

generateSwagger(
	"./domain-repos/@services/draft-services/api/build/build.yaml",
	"./openapi/services",
	SERVICES_SCENARIOS,
	[
		{
			url: `${process.env.SERVER_LINK}/services/bpp`,
			description: "Sandbox as seller",
		},
		{
			url: `${process.env.SERVER_LINK}/services/bap`,
			description: "Sandbox as buyer",
		},
	]
);

generateSwagger(
	"./domain-repos/@services/draft-agri-services/api/build/build.yaml",
	"./openapi/agri-services",
	SERVICES_SCENARIOS,
	[
		{
			url: `${process.env.SERVER_LINK}/services/bpp`,
			description: "Sandbox as seller",
		},
		{
			url: `${process.env.SERVER_LINK}/services/bap`,
			description: "Sandbox as buyer",
		},
	]
);
