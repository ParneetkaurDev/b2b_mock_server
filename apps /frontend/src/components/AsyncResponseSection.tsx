import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMock } from "../utils/hooks";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import Box from "@mui/material/Box";
import { useState, MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";


export const AsyncResponseSection = () => {
	
	const { asyncResponse } = useMock();
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
	const copyAsyncResponse = () => {
		navigator.clipboard
			.writeText(JSON.stringify(asyncResponse))
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
					<Typography variant="h6">Async Request/Response:</Typography>
					{asyncResponse && (
						<Fade in={display} timeout={600}>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={copyAsyncResponse}
							>
								{copied ? <DoneAllIcon color="success" /> : <ContentCopyIcon />}
							</IconButton>
						</Fade>
					)}
				</Box>
				{asyncResponse ? (
					<CodeMirror
						value={JSON.stringify(asyncResponse, null, 2)}
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
							// lineWrapping: true,
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
