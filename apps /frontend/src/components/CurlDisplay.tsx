import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { MouseEvent, useRef, useState } from "react";
import Fade from "@mui/material/Fade";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

const localTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

type CurlDisplayProps = {
	slideIn: boolean;
	curl?: string;
};

export const CurlDisplay = ({
	slideIn,
	curl = "Something here",
}: CurlDisplayProps) => {
	const containerRef = useRef<HTMLElement>(null);
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

	const copyCurl = () => {
		navigator.clipboard
			.writeText(curl)
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
		<Box
			sx={{
				overflow: "hidden",
			}}
			ref={containerRef}
		>
			<ThemeProvider theme={localTheme}>
				<Slide
					in={slideIn}
					timeout={1500}
					container={containerRef.current}
					mountOnEnter
					unmountOnExit
				>
					<Paper
						sx={{
							p: 2,
							// position: "relative",
						}}
						onMouseEnter={(e) => showButton(e)}
						onMouseLeave={(e) => hideButton(e)}
					>
						<Box
							sx={
								{
									// position: "absolute",
									// top: 0,
									// left: 0,
									// zIndex: 50,
								}
							}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									my: 1,
								}}
							>
								<Typography variant="h6" mr={2}>
									Curl:
								</Typography>
								<Typography color="text.secondary">
									You can just paste this CURL in your CLI and see it work
									yourself
								</Typography>
								<Fade in={display} timeout={600}>
									<IconButton
										size="small"
										// sx={{
										// 	display: display ? "block" : "none",
										// }}
										onClick={copyCurl}
									>
										{copied ? (
											<DoneAllIcon color="success" />
										) : (
											<ContentCopyIcon />
										)}
									</IconButton>
								</Fade>
							</Box>

							<CodeMirror
								value={curl}
								autoCursor={false}
								options={{
									readOnly: "nocursor",
									theme: "material",
									height: "auto",
									viewportMargin: Infinity,
									mode: "shell",
									lineNumbers: true,
									lineWrapping: true,
									indentWithTabs: false,
									tabSize: 2,
								}}
							/>
						</Box>
						<Box
							sx={{
								position: "absolute",
								top: 0,
								right: 0,
								zIndex: 55,
								height: "100%",
								px: 2,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								background: display ? "rgba(255, 255, 255, 0.08)" : "none",
							}}
						></Box>
					</Paper>
				</Slide>
			</ThemeProvider>
		</Box>
	);
};
