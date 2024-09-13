import useTheme from "@mui/material/styles/useTheme";
import { BaseEdge, getBezierPath, EdgeProps } from "reactflow";
import "./index.css";

export const CustomEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
}: EdgeProps) => {
	const theme = useTheme();
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	});

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				markerEnd={markerEnd}
				style={{
					strokeWidth: 2,
					stroke: theme.palette.primary.light,
				}}
			/>
		</>
	);
};
