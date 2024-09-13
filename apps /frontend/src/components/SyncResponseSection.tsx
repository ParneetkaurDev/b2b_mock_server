import { UnControlled as CodeMirror } from "react-codemirror2";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import { useState, MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Box from "@mui/material/Box";

type SyncResponseSectionProps = {
	syncResponse: object | undefined
}

export const SyncResponseSection = ({syncResponse}: SyncResponseSectionProps) => {
	const [display, setDisplay] = useState(false);
	const [copied, setCopied] = useState(false);
	const showButton = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		setDisplay(true);
	};

	const hideButton = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		setDisplay(false);
	};
	const copySyncResponse = () => {
		navigator.clipboard
			.writeText(JSON.stringify(syncResponse))
			.then(() => {
				setCopied(true);
				setTimeout(function () {
					setCopied(false);
				}, 1000);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					height: "100%",
					p: 1,
					px: 2,
					overflow: "hidden",
				}}
				onMouseEnter={(e) => showButton(e)}
				onMouseLeave={(e) => hideButton(e)}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						my: 1,
					}}
				>
					<Typography variant="h6">Sync Response:</Typography>
					{syncResponse && (
						<Fade in={display} timeout={600}>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={copySyncResponse}
							>
								{copied ? <DoneAllIcon color="success" /> : <ContentCopyIcon />}
							</IconButton>
						</Fade>
					)}
				</Box>
				{syncResponse ? (
					<CodeMirror
						value={JSON.stringify(syncResponse, null, 2)}
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
				) : (
					<Typography color="text.secondary" variant="subtitle2">
						Click on Submit to initiate Response
					</Typography>
				)}
			</Paper>
		</Fade>
	);
};
