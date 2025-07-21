import { createContext } from "react";

export type User = { id: string; email: string; name?: string } | null;

export interface AuthCtx {
    user: User;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);
