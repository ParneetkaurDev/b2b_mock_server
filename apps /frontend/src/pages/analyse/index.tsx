import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import useTheme from "@mui/material/styles/useTheme";

import {
	LogDialog,
	TransactionSearch,
	TransactionVisualizer,
} from "../../components";

import "reactflow/dist/style.css";

export const Analyse = () => {
	const theme = useTheme();

	return (
		<Container
			sx={{
				height: `calc(100% - ${
					(theme.mixins.toolbar.minHeight as number) + 10
				}px)`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Fade in={true} timeout={800}>
				<Typography variant="h3" color="text.secondary" my={2}>
					Transaction Analyser
				</Typography>
			</Fade>
			<TransactionSearch />
			<TransactionVisualizer />
			<LogDialog />
		</Container>
	);
};
