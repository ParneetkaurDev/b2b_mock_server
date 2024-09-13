import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "openapi-specs/b2c.json";
import { SwaggerDownloadButton } from "../../../../components";

export const B2CSwagger = () => {
	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<SwaggerDownloadButton swaggerYaml={swaggerSpec} fileName="B2C.yaml" />
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
