import Button from "@mui/joy/Button";
import { Download } from "@mui/icons-material";
import jsYaml from "js-yaml";

interface DownloadButtonProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	swaggerYaml: any; // Adjust the type as per your Swagger YAML structure
	fileName?: string;
}
export const SwaggerDownloadButton = ({
	swaggerYaml,
	fileName,
}: DownloadButtonProps) => {
	
	const handleDownload = () => {
		const yamlContent = jsYaml.dump(swaggerYaml);
		const blob = new Blob([yamlContent], { type: "text/yaml" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = fileName || "swagger.yaml";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<Button startDecorator={<Download />} onClick={handleDownload}>
			Download Collection
		</Button>
	);
};
