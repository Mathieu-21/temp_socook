import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// GET panier utilisateur
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      `SELECT c.id_cart_item, c.quantity, p.* 
       FROM cart_items c 
       JOIN products p ON c.id_product = p.id_product 
       WHERE c.id_user = $1`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Failed to get cart" });
  }
});

// Ajouter un produit au panier
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Vérifier si le produit existe déjà dans le panier
    const checkResult = await db.query(
      "SELECT * FROM cart_items WHERE id_user = $1 AND id_product = $2",
      [userId, productId]
    );
    
    if (checkResult.rows.length > 0) {
      // Mettre à jour la quantité si le produit existe déjà
      const result = await db.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE id_user = $2 AND id_product = $3 RETURNING *",
        [quantity, userId, productId]
      );
      return res.json(result.rows[0]);
    } else {
      // Ajouter un nouveau produit au panier
      const result = await db.query(
        "INSERT INTO cart_items (id_user, id_product, quantity) VALUES ($1, $2, $3) RETURNING *",
        [userId, productId, quantity]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Mettre à jour la quantité d'un produit
router.put("/:itemId", async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      // Supprimer l'article si la quantité est 0 ou négative
      await db.query("DELETE FROM cart_items WHERE id_cart_item = $1", [itemId]);
      return res.json({ message: "Item removed from cart" });
    } else {
      // Mettre à jour la quantité
      const result = await db.query(
        "UPDATE cart_items SET quantity = $1 WHERE id_cart_item = $2 RETURNING *",
        [quantity, itemId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// Supprimer un produit du panier
router.delete("/:itemId", async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    await db.query("DELETE FROM cart_items WHERE id_cart_item = $1", [itemId]);
    
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Vider le panier d'un utilisateur
router.delete("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    await db.query("DELETE FROM cart_items WHERE id_user = $1", [userId]);
    
    res.json({ message: "Cart emptied" });
  } catch (error) {
    console.error("Error emptying cart:", error);
    res.status(500).json({ error: "Failed to empty cart" });
  }
});

export default router;
