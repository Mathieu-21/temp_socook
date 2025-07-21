import { useReducer, type ReactNode } from "react";
import { CartContext, reducer } from "./CartContextDefinition";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
