import { useContext } from "react";
import { StudioFilterContext } from "../contexts/StudioFilterContext.js";

export function useStudioFilter() {
    const ctx = useContext(StudioFilterContext);
    if (!ctx)
        throw new Error(
            "useStudioFilter must be used within StudioFilterProvider"
        );
    return ctx;
}