import { useContext } from "react";
import { DomainContext } from "../context";

export const useDomain = () => useContext(DomainContext);
