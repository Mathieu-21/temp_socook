import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextDefinition";
import { CartContext } from "../contexts/CartContextDefinition";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
