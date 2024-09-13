import { createContext, useState } from "react";

type MockProviderType = {
	children: React.ReactNode;
};
type MockContextType = {
	syncResponse: object | undefined;
	setSyncResponse: React.Dispatch<React.SetStateAction<object>>;
	asyncResponse: object | undefined;
	setAsyncResponse: React.Dispatch<React.SetStateAction<object>>;
};
export const MockContext = createContext<MockContextType>({
	syncResponse: {},
	asyncResponse: {},
	setSyncResponse: () => {},
	setAsyncResponse: () => {},
});

export const MockProvider = ({ children }: MockProviderType) => {
	const [syncResponse, setSyncResponse] = useState<object>();
	const [asyncResponse, setAsyncResponse] = useState<object>();
	return (
		<MockContext.Provider
			value={{ syncResponse, setSyncResponse, asyncResponse, setAsyncResponse }}
		>
			{children}
		</MockContext.Provider>
	);
};
