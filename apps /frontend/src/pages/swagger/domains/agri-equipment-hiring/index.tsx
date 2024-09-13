import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "openapi-specs/agri-equipment-hiring.json";
import { SwaggerDownloadButton } from "../../../../components";

export const AgriEquipmentHiringSwagger = () => {
	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<SwaggerDownloadButton
					swaggerYaml={swaggerSpec}
					fileName="Services.yaml"
				/>
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
