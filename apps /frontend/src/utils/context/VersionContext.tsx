import { createContext, useState } from "react";

type VersionProviderType = {
	children: React.ReactNode;
};
type VersionContextType = {
	version: string;
	setVersion: React.Dispatch<React.SetStateAction<string>>;
};

export const VersionContext = createContext<VersionContextType>({
	version: "",
	setVersion: () => {},
});

export const VersionProvider = ({ children }: VersionProviderType) => {
	const [version, setVersion] = useState("");
	return (
		<VersionContext.Provider value={{ version, setVersion }}>
			{children}
		</VersionContext.Provider>
	);
};
