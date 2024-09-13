import { useContext } from "react";
import { VersionContext } from "../context";

export const useVersion = () => useContext(VersionContext);
