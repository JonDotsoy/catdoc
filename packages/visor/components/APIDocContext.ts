import { createContext, createElement, FC } from "react";
import { APIDocProps } from "./APIDocProps";

export const APIDocContext = createContext<APIDocProps>(null);

export const APIDocContextProvider: FC<APIDocProps> = ({ children, ...props }) => {
    return createElement(
        APIDocContext.Provider,
        { value: props },
        children,
    );
}
