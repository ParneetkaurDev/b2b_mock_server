import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useMessage } from "../utils/hooks";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const MessageDialog = () => {
	const { showDialog, closeDialog, message, messageType, copy } = useMessage();
	const copyContent = () => {
		if (copy)
			navigator.clipboard.writeText(copy).catch((err) => {
				console.log(err.message);
			});
	};
	return (
		<Dialog open={showDialog} onClose={closeDialog}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					p: 2,
				}}
			>
				{messageType === "info" && <InfoTwoToneIcon color="info" />}
				{messageType === "error" && <WarningTwoToneIcon color="warning" />}
				{messageType === "success" && (
					<CheckCircleTwoToneIcon color="success" />
				)}
				<Typography variant="h5" ml={1}>
					Message
				</Typography>
			</Box>
			<DialogContent
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-start",
				}}
			>
				<Typography>{message}</Typography>
				{copy && (
					<IconButton onClick={copyContent}>
						<ContentCopyIcon />
					</IconButton>
				)}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="secondary" onClick={closeDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
