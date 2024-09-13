import { Toolbar } from "@mui/material";
import "swagger-ui-react/swagger-ui.css";
import { SwaggerDownloadButton } from "../../components";
import b2bswaggerSpec from "openapi-specs/retail-b2b.json";
import serviceswaggerSpec from "openapi-specs/services.json";
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import { useDomain } from "../../utils/hooks";

export const Swagger = () => {
	const [swaggerSpec, setSwaggerSpec] = useState(b2bswaggerSpec);
	const [fileName, setFileName] = useState("B2b.yaml");
	const { domain } = useDomain();

	useEffect(()=>{
		const swaggerFile = domain === "retail"?b2bswaggerSpec:serviceswaggerSpec;
		const yamlFileName = domain === "retail"?"B2b.yaml":"services.yaml";
		setSwaggerSpec(swaggerFile);
		setFileName(yamlFileName);
	}, [domain]);

	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<SwaggerDownloadButton swaggerYaml={swaggerSpec} fileName={fileName} />
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
