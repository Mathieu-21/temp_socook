import { createContext, type Dispatch } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
}

export type Action =
    | { type: "ADD"; item: CartItem }
    | { type: "REMOVE"; id: string }
    | { type: "CLEAR" };

export function reducer(state: CartItem[], action: Action): CartItem[] {
    switch (action.type) {
        case "ADD": {
            const existing = state.find((i) => i.id === action.item.id);
            return existing
                ? state.map((i) =>
                    i.id === action.item.id
                        ? { ...i, qty: i.qty + action.item.qty }
                        : i
                )
                : [...state, action.item];
        }
        case "REMOVE":
            return state.filter((i) => i.id !== action.id);
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

export const CartContext = createContext<
    { items: CartItem[]; dispatch: Dispatch<Action> } | undefined
>(undefined);
