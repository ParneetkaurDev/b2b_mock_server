import { createContext, useState , Dispatch, SetStateAction} from "react";

type MessageProviderType = {
	children: React.ReactNode;
};

type MessageContextType = {
	message: string | undefined;
	messageType: "info" | "error" | "success";
	setMessageType: (m: "info" | "error" | "success") => void;
	copy: string | undefined;
	setCopy: Dispatch<SetStateAction<string | undefined>>;
	showDialog: boolean;
	handleMessageToggle: (m: string) => void;
	closeDialog: () => void;
};

export const MessageContext = createContext<MessageContextType>({
	message: "",
	messageType: "info",
	setMessageType: () => {},
	copy: "",
	setCopy: () => {},
	showDialog: true,
	handleMessageToggle: () => {},
	closeDialog: () => {},
});

export const MessageProvider = ({ children }: MessageProviderType) => {
	const [message, setMessage] = useState<string>();
	const [messageType, setMessageType] = useState<"info" | "error" | "success">(
		"info"
	);
	const [copy, setCopy] = useState<string>();
	const [showDialog, setShowDialog] = useState<boolean>(false);
	
	const handleMessageToggle = (message: string) => {
		setMessage(message);
		setShowDialog(true);
	};

	const closeDialog = () => {
		setMessage("");
		setShowDialog(false);
		setCopy(undefined);
		setMessageType("info")
	};

	return (
		<MessageContext.Provider
			value={{
				message,
				messageType,
				setMessageType,
				copy,
				setCopy,
				showDialog,
				handleMessageToggle,
				closeDialog,
			}}
		>
			{children}
		</MessageContext.Provider>
	);
};
