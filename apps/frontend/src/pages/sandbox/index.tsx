import Container from "@mui/material/Container";
import { SandboxProvider } from "../../utils/context";
import { Outlet } from "react-router-dom";
import { MessageDialog, SandboxRequestSection } from "../../components";
import { Grid } from "@mui/material";
import { InitiateRequestSection } from "./InitiateRequestSection";
import { SandboxSyncResponseSection } from "./SandboxSyncResponseSection";

export const Sandbox = () => {
	return (
		<SandboxProvider>
			<Container sx={{ py: 2 }}>
				<Outlet />
				<Grid container spacing={2}>
			<Grid item xs={12} lg={8}>
				<SandboxRequestSection/>
			</Grid>
			<Grid container item xs={12} lg={4}>
				<Grid item xs={12} sm={6} lg={12}>
					<InitiateRequestSection/>
				</Grid>
				<Grid item xs={12} sm={6} lg={12}>
					<SandboxSyncResponseSection />
				</Grid>
			</Grid>
		</Grid>
				<MessageDialog />
			</Container>
		</SandboxProvider>
	);
};
