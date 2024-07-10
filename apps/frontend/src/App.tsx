import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Analyse, Landing, Mock, Sandbox, Sign, Swagger } from "./pages";
import {
	AgriServicesSwagger,
	AuthSwagger,
	B2BSwagger,
	HealthCareServicesSwagger,
	MiscSwagger,
	ServicesSwagger,
} from "./pages/swagger/domains";
import {
	AnalyseProvider,
	MessageProvider,
	MockProvider,
	SandboxProvider,
} from "./utils/context";
import { AgriServicesMock, B2BMock, HealthCareServicesMock, ServicesMock } from "./pages/mock/domains";
import { B2BSandbox, ServicesSandbox } from "./pages/sandbox/domains";
import { AgriServicesSandbox } from "./pages/sandbox/domains/agri-services";
import { HealthCareServicesSandbox } from "./pages/sandbox/domains/healthcare-services";
import Readme from "./pages/readme";

// log

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				path: "/",
				Component: Landing,
			},
			{
				path: "/user-guide",
				Component: Readme,
			},
			{
				path: "/sign-check",
				Component: Sign,
			},
			{
				path: "/mock",
				Component: () => (
					<MockProvider>
						<Mock />
					</MockProvider>
				),
				children: [
					{
						path: "b2b",
						Component: B2BMock,
					},
					{
						path: "services",
						Component: ServicesMock,
					},
					{
						path: "agri-services",
						Component: AgriServicesMock,
					},
					{
						path: "healthcare-services",
						Component: HealthCareServicesMock,
					},
				],
			},
			{
				path: "/sandbox",
				Component: () => (
					<SandboxProvider>
						<Sandbox />
					</SandboxProvider>
				),
				children: [
					{
						path: "b2b",
						Component: B2BSandbox,
					},
					{
						path: "services",
						Component: ServicesSandbox,
					},
					{
						path: "agri-services",
						Component: AgriServicesSandbox,
					},
					{
						path: "healthcare-services",
						Component: HealthCareServicesSandbox,
					},
				],
			},
			{
				path: "/swagger/misc",
				Component: MiscSwagger,
			},
			{
				path: "/swagger",
				Component: Swagger,
				// children: [
				// 	{ path: "b2b", Component: B2BSwagger },
				// 	{ path: "services", Component: ServicesSwagger },
				// 	{ path: "agri-services", Component: AgriServicesSwagger },
				// 	{ path: "healthcare-services", Component: HealthCareServicesSwagger },
				// 	{ path: "auth", Component: AuthSwagger },
				// 	{ path: "misc", Component: MiscSwagger },
				// ],
			},
			{
				path: "/analyse",
				Component: () => (
					<AnalyseProvider>
						<Analyse />
					</AnalyseProvider>
				),
			},
		],
	},
]);

export default function App() {
	return (
		<MessageProvider>
			<RouterProvider router={router} />
		</MessageProvider>
	);
}
