import { Toolbar } from "@mui/material";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import "swagger-ui-react/swagger-ui.css";
import { SwaggerDownloadButton } from "../../components";
import serviceswaggerSpec from "openapi-specs/retail-b2b.json";
import { useState } from "react";
import SwaggerUI from "swagger-ui-react";
import { Select } from "@mui/joy";
import { SWAGGER_DOMAIN_FIELDS } from "../../utils";

export const Swagger = () => {
	const [swaggerSpec, setSwaggerSpec] = useState(serviceswaggerSpec);

	const handleActionSelection = (
		_event: any,
		newValue: string | null
	) => {
		console.log("Valuessssssssssss", newValue);
		// setRenderActionFields(false);
		// setAction(newValue as string);
		// setFormState({});
		// setAllowSubmission(false);
		// setTimeout(() => setRenderActionFields(true), 500);
	};
	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				{/* <Select
					placeholder={SWAGGER_DOMAIN_FIELDS.placeholder}
					onChange={(
						_event: React.SyntheticEvent | null,
						newValue: string | null
					) => handleActionSelection(SWAGGER_DOMAIN_FIELDS.name, newValue as string)}
				>
					{(SWAGGER_DOMAIN_FIELDS.options as string[]).map((option, index: number) => (
						<Option value={option} key={option + index}>
							{option}
						</Option>
					))
					}
				</Select> */}
				<SwaggerDownloadButton swaggerYaml={swaggerSpec} fileName="B2b.yaml" />
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
		// <Container>
		// 	<Outlet/>
		// <Toolbar
		// 	sx={{
		// 		display: "flex",
		// 		justifyContent: "flex-end",
		// 	}}
		// >
		// 	<Select placeholder="Select Action" onChange={handleActionSelection}>
		// 			{/* {Object.keys(INITIATE_FIELDS).map((action, idx) => (
		// 				<Option value={action} key={"action-" + idx}>
		// 					{action}
		// 				</Option>
		// 			))} */}
		// 		</Select>
		// 	<SwaggerDownloadButton
		// 		swaggerYaml={swaggerSpec}
		// 		fileName="B2b.yaml"
		// 	/>
		// </Toolbar>
		// <SwaggerUI spec={swaggerSpec} />
		// </Container>
	);
};
