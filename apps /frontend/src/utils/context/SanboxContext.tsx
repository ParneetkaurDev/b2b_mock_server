import { createContext, useState } from "react";

type SandboxProviderType = {
	children: React.ReactNode;
};
type SandboxContextType = {
	syncResponse: object | undefined;
	setSyncResponse: React.Dispatch<React.SetStateAction<object>>;
};
export const SandboxContext = createContext<SandboxContextType>({
	syncResponse: {},
	setSyncResponse: () => {},
});

export const SandboxProvider = ({ children }: SandboxProviderType) => {
	const [syncResponse, setSyncResponse] = useState<object>();
	return (
		<SandboxContext.Provider value={{ syncResponse, setSyncResponse }}>
			{children}
		</SandboxContext.Provider>
	);
};
