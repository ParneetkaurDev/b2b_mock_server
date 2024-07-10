import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { AsyncResponseSection } from "../../components/AsyncResponseSection";
import { MockProvider } from "../../utils/context";
import { Outlet } from "react-router-dom";
import { MockSyncResponseSection } from "./MockSyncResponseSection";
import { MockRequestSection } from "../../components";

export const Mock = () => {
	return (
		<MockProvider>
			<Container sx={{ py: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} lg={8}>
					<MockRequestSection/>
						<Outlet />
					</Grid>
					<Grid container item xs={12} lg={4} spacing={2}>
						<Grid item xs={12} sm={6} lg={12}>
							<MockSyncResponseSection/>
						</Grid>
						<Grid item xs={12} sm={6} lg={12}>
							<AsyncResponseSection />
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</MockProvider>
	);
};
