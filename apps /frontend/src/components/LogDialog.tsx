import * as _ from "lodash";
import { useState } from "react";
import {
	LOGISTICS_SCENARIOS,
	B2B_SCENARIOS,
	SERVICES_SCENARIOS,
	NEXT_ACTION,
	NEXT_ACTION_LOGISTICS,
} from "openapi-specs/constants";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Button from "@mui/joy/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useAnalyse } from "../utils/hooks";
import { copyToClipboard } from "../utils";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

export const LogDialog = () => {
	const { openLogDialog: open, setOpenLogDialog, logToShow } = useAnalyse();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const log = logToShow as any;

	const [copiedRequest, setCopiedRequest] = useState(false);
	const [copiedResponse, setCopiedResponse] = useState(false);

	// Function to toggle the copied state for request
	const toggleRequestCopy = () => {
		setCopiedRequest(true);
		setTimeout(() => {
			setCopiedRequest(false);
		}, 1000);
	};

	// Function to toggle the copied state for response
	const toggleResponseCopy = () => {
		setCopiedResponse(true);
		setTimeout(() => {
			setCopiedResponse(false);
		}, 1000);
	};

	// Determine the action mapping based on the domain
	const getActionName = (action: string, toBeSent: boolean) => {
		if (toBeSent) {
			// Determine domain, default to 'services' if not specified
			const domain = log.domain?.toLowerCase() || "services";

			const actionMapping =
				domain === "logistics" ? NEXT_ACTION_LOGISTICS : NEXT_ACTION;

			return actionMapping[action as keyof typeof actionMapping] || action;
		}
		return action;
	};

	return (
		<Dialog open={open} onClose={() => setOpenLogDialog(false)}>
			<DialogTitle variant="h5">Request Analyser</DialogTitle>
			<DialogContent>
				{log.action && (
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography>Action:</Typography>
						<Typography variant="body2" color="text.secondary">
							/{getActionName(log.action, log.toBeSent)}
						</Typography>
					</Stack>
				)}
				{log.type && (
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography>Type:</Typography>
						<Typography variant="body2" color="text.secondary">
							{log.type}
						</Typography>
					</Stack>
				)}
				{log.request && (
					<>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Request:</Typography>
							<IconButton
								size="small"
								onClick={() => copyToClipboard(log.request, toggleRequestCopy)}
							>
								{copiedRequest ? (
									<DoneAllIcon color="success" />
								) : (
									<ContentCopyIcon />
								)}
							</IconButton>
						</Stack>
						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>Request Timestamp:</Typography>
							<Typography variant="body2" color="text.secondary">
								{log.request.context.timestamp}
							</Typography>
						</Stack>
						<CodeMirror
							value={JSON.stringify(log.request, null, 2)}
							autoCursor={false}
							options={{
								readOnly: "nocursor",
								theme: "material",
								height: "auto",
								viewportMargin: Infinity,
								mode: {
									name: "javascript",
									json: true,
									statementIndent: 2,
								},
								lineNumbers: true,
								lineWrapping: true,
								indentWithTabs: false,
								tabSize: 2,
							}}
						/>
					</>
				)}
				{log.response && (
					<>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Response:</Typography>
							<IconButton
								size="small"
								onClick={() =>
									copyToClipboard(log.response, toggleResponseCopy)
								}
							>
								{copiedResponse ? (
									<DoneAllIcon color="success" />
								) : (
									<ContentCopyIcon />
								)}
							</IconButton>
						</Stack>
						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>Response Timestamp:</Typography>
							<Typography variant="body2" color="text.secondary">
								{log.response.timestamp}
							</Typography>
						</Stack>
						<CodeMirror
							value={JSON.stringify(log.response.response, null, 2)}
							autoCursor={false}
							options={{
								readOnly: "nocursor",
								theme: "material",
								height: "auto",
								viewportMargin: Infinity,
								mode: {
									name: "javascript",
									json: true,
									statementIndent: 2,
								},
								lineNumbers: true,
								lineWrapping: true,
								indentWithTabs: false,
								tabSize: 2,
							}}
						/>
					</>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="warning"
					startDecorator={<CancelTwoToneIcon />}
					onClick={() => setOpenLogDialog(false)}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
