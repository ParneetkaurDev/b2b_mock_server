import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";

const drawerWidth = 200;
const NAV_LINKS = [
	{
		name: "Mock Server",
		nested:false,
		path: "/mock",
	},
	{
		name: "Sandbox",
		nested:false,
		path: "/sandbox",
	},
	{
		name: "Swagger",
		nested:false,
		path: "/swagger",
	},
];

const DOMAIN_NAVS = [
	{
		name: "Home",
		nested: false,
		path: "/",
	},
	...NAV_LINKS,
	// {
	// 	name: "B2B",
	// 	nested: true,
	// 	path: "/b2b",
	// 	children: NAV_LINKS,
	// },
	// {
	// 	name: "Services",
	// 	nested: true,
	// 	path: "/services",
	// 	children: NAV_LINKS,
	// },
	// {
	// 	name: "Agriculture Services",
	// 	nested: true,
	// 	path: "/agri-services",
	// 	children: NAV_LINKS,
	// },

	// {
	// 	name: "Healthcare Services",
	// 	nested: true,
	// 	path: "/healthcare-services",
	// 	children: NAV_LINKS,
	// },
	
	{
		name: "Sign Check",
		nested: false,
		path: "/sign-check",
		// path: "/swagger/auth",
	},
	{
		name: "Analyse Transaction",
		nested: false,
		path: "/analyse",
	},
	{
		name: "Misc. Swagger",
		nested: false,
		path: "/swagger/misc"
	},
	{
		name: "User Guide",
		nested: false,
		path: "/user-guide"
	}
];
type CustomDrawerProps = {
	children: React.ReactNode;
};

type NestedMenuProps = {
	id: string;
	name: string;
	childPath: { name: string; path: string }[] | undefined;
	parentPath: string;
	growIn: boolean
};

const NestedMenu = ({ id, name, childPath, parentPath, growIn }: NestedMenuProps) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [accordionOpened, setAccordionOpened] = React.useState(false);
	return (
		<Grow in={growIn} timeout={1000} key={"nested-nav-" + id}>
			<Accordion
				sx={{
					my: 0,
					bgcolor: theme.palette.primary.dark,
					color: theme.palette.primary.contrastText,
					"&.Mui-selected": {
						backgroundColor: theme.palette.primary.main,
					},
				}}
				square={true}
				disableGutters={true}
				elevation={0}
				onChange={(_event, expanded) => setAccordionOpened(expanded)}
			>
				<AccordionSummary
					expandIcon={
						<ArrowDropDownIcon
							sx={{ color: theme.palette.primary.contrastText }}
						/>
					}
					aria-controls="panel2-content"
					id={id}
				>
					<Typography>{name}</Typography>
				</AccordionSummary>
				<AccordionDetails
					sx={{
						bgcolor: theme.palette.grey[100],
						color: theme.palette.getContrastText(theme.palette.grey[100]),
						p: 0,
					}}
				>
					<List sx={{ py: 0 }}>
						{childPath?.map((link, index) => (
							<Grow in={accordionOpened} timeout={800} key={id + index}>
								<ListItem key={index} disablePadding>
									<ListItemButton
										onClick={() => navigate(link.path + parentPath)}
										selected={location.pathname === link.path + parentPath}
										sx={{
											"&.Mui-selected": {
												backgroundColor: theme.palette.primary.light,
												color: theme.palette.getContrastText(
													theme.palette.primary.light
												),
											},
										}}
									>
										<ListItemText
											primary={link.name}
											sx={{ textAlign: "center" }}
										/>
									</ListItemButton>
								</ListItem>
							</Grow>
						))}
					</List>
				</AccordionDetails>
			</Accordion>
		</Grow>
	);
};

export const CustomDrawer = ({ children }: CustomDrawerProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};
	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{DOMAIN_NAVS.map((link, index) => (
					<>
						{/* {link.nested ? (
							<NestedMenu
								name={link.name}
								childPath={link.children}
								parentPath={link.path}
								id={"nav-nested-menu-" + index}
								growIn={mobileOpen}
							/>
						) : ( */}
							<Grow
								in={mobileOpen}
								timeout={1000}
								key={"nonnested-nav-" + index}
							>
								<ListItem disablePadding key={index}>
									<ListItemButton
										onClick={() => navigate(link.path)}
										selected={location.pathname === link.path}
										sx={{
											bgcolor: theme.palette.primary.dark,
											color: theme.palette.primary.contrastText,
											"&.Mui-selected": {
												backgroundColor: theme.palette.primary.light,
											},
											"&:hover": {
												color: theme.palette.common.black,
											},
										}}
									>
										<ListItemText primary={link.name} />
									</ListItemButton>
								</ListItem>
							</Grow>
						{/* )
						} */}
						<Divider />
					</>
				))}
			</List>
			<Divider />
		</div>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar component="nav">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
					>
						ONDC Mock & Sandbox
					</Typography>
				</Toolbar>
			</AppBar>
			<Box component="nav">
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					PaperProps={{
						sx: {
							// backgroundColor: theme.palette.primary.dark,
							// color: theme.palette.primary.contrastText,
						},
					}}
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<IconButton
							// sx={{ color: theme.palette.primary.contrastText }}
							onClick={handleDrawerToggle}
						>
							<MenuOpenIcon />
						</IconButton>
					</Box>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					// p: 3,
					minHeight: "100vh",
					// width: { sm: `calc(100% - ${drawerWidth}px)` },
					backgroundColor: theme.palette.grey[100],
				}}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};
