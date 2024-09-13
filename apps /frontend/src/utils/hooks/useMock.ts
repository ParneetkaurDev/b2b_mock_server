import { useContext } from "react";
import { MockContext } from "../context";

export const useMock = () => useContext(MockContext);
