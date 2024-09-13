import { useAnalyse } from "../utils/hooks";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { hexToRgb } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import ReactFlow, { Background, Controls } from "reactflow";
import { CustomEdge, CustomNode } from ".";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };
export const TransactionVisualizer = () => {
	const theme = useTheme();
	const { nodes, edges, onNodesChange, onEdgesChange } = useAnalyse();
	return (
		<>
			{nodes.length > 0  && (
				<Paper
					sx={{
						my: 10,
						minWidth: "100%",
						p: 2,
						borderRadius: theme.shape.borderRadius * 2,
						background: hexToRgb(theme.palette.background.paper).replace(
							")",
							",0.05)"
						),
						backdropFilter: `blur(6px)`,
						_webkitBackDropFilter: `blur(6px)`,
					}}
					elevation={5}
				>
					<Box
						sx={{
							borderStyle: "solid",
							borderColor: theme.palette.divider,
							borderRadius: theme.shape.borderRadius,
							borderWidth: 1,
							p: 1,
							height: 500,
						}}
					>
						<ReactFlow
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							edgeTypes={edgeTypes}
						>
							<Controls />
							<Background />
						</ReactFlow>
					</Box>
				</Paper>
			)}
		</>
	);
};
