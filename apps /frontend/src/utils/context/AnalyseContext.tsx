import { createContext, useState } from "react";
import { CustomNodeData } from "../../components";
import {
	useEdgesState,
	useNodesState,
	Node,
	Edge,
	NodeChange,
	EdgeChange,
} from "reactflow";

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

type AnalyseProviderType = {
	children: React.ReactNode;
};

type AnalyseContextType = {
	openLogDialog: boolean;
	setOpenLogDialog: React.Dispatch<React.SetStateAction<boolean>>;
	logToShow: object | undefined;
	setLogToShow: React.Dispatch<React.SetStateAction<object>>;
	nodes: Node<CustomNodeData, string | undefined>[];
	setNodes: React.Dispatch<
		React.SetStateAction<Node<CustomNodeData, string | undefined>[]>
	>;
	onNodesChange: OnChange<NodeChange>;
	edges: Edge[];
	setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
	onEdgesChange: OnChange<EdgeChange>;
};
export const AnalyseContext = createContext<AnalyseContextType>({
	openLogDialog: false,
	setOpenLogDialog: () => {},
	logToShow: {},
	setLogToShow: () => {},
	nodes: [],
	setNodes: () => {},
	onNodesChange: () => {},
	edges: [],
	setEdges: () => {},
	onEdgesChange: () => {},
});

export const AnalyseProvider = ({ children }: AnalyseProviderType) => {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [openLogDialog, setOpenLogDialog] = useState(false);
	const [logToShow, setLogToShow] = useState<object>({});
	
	console.log("TransactionVisualizer",children,nodes,edges,logToShow)
	return (
		<AnalyseContext.Provider
			value={{
				openLogDialog,
				setOpenLogDialog,
				logToShow,
				setLogToShow,
				nodes,
				setNodes,
				onNodesChange,
				edges,
				setEdges,
				onEdgesChange,
			}}
		>
			{children}
		</AnalyseContext.Provider>
	);
};
