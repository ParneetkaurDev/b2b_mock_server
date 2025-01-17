import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Analyse, Landing, Mock, Sandbox, Sign, Swagger } from "./pages";
import {
	B2BSwagger,
	MiscSwagger,
	ServicesSwagger,
} from "./pages/swagger/domains";
import {
	AnalyseProvider,
	DomainProvider,
	MessageProvider,
	MockProvider,
	SandboxProvider,
} from "./utils/context";
import {
	B2BMock,
	ServicesMock,
} from "./pages/mock/domains";
import { B2BSandbox, ServicesSandbox } from "./pages/sandbox/domains";
import Readme from "./pages/readme";
import { B2CMock } from "./pages/mock/domains/b2c";
import { B2CSandbox } from "./pages/sandbox/domains/b2c";

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
						path: "b2c",
						Component: B2CMock,
					},
					{
						path: "services",
						Component: ServicesMock,
					}
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
						path: "b2c",
						Component: B2CSandbox,
					},
					{
						path: "services",
						Component: ServicesSandbox,
					}
				],
			},
			{
				path: "/swagger/misc",
				Component: MiscSwagger,
			},
			{
				path: "/swagger",
				Component: Swagger,
				children: [
					{ path: "b2b", Component: B2BSwagger },
					{ path: "b2c", Component: B2BSwagger },
					{ path: "services", Component: ServicesSwagger },
				],
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
			<DomainProvider>
				<RouterProvider router={router} />
			</DomainProvider>
		</MessageProvider>
	);
}
