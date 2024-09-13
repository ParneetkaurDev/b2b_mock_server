import { useContext } from "react";
import { SandboxContext } from "../context";

export const useSandbox = () => useContext(SandboxContext);
