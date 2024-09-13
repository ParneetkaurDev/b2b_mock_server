import { styled } from "@mui/material/styles";
import { Button, Box } from "@mui/material";
import Background_Img from "../../assets/images/Background.jpg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BackgroundContainer = styled(Box)(() => ({
	backgroundImage: `url(${Background_Img})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	height: "calc(100vh - 64px)",
	justifyContent: "center",
	alignItems: "center",
}));

export const StyledBox = styled(Box)(({ theme }) => ({
	flex: 1,
	padding: theme.spacing(4),
	backgroundColor: theme.palette.background.paper,
	zIndex: 1,
	boxShadow: theme.shadows[5],
	borderRadius: theme.shape.borderRadius,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	alignItems: "center",
	maxWidth: "65%",
	maxHeight: "90%",
	margin: theme.spacing(2),
	textAlign: "center",
	overflow: "auto",
}));
export const InfoPanel = styled(Box)(({ theme }) => ({
	flex: 1,
	padding: theme.spacing(4),
	paddingBottom: theme.spacing(2),
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[5],
	borderRadius: theme.shape.borderRadius,
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	maxWidth: "23%",
	maxHeight: "100%",
	margin: theme.spacing(2),
	marginBottom: 0,
	overflow: "auto",
	zindex: 1,
}));

export const CustomButton = styled(Button)(({ theme }) => ({
	textTransform: "none",
	marginTop: theme.spacing(2),
	width: "180px",
	height: "45px",
	fontSize: "1rem",
}));
