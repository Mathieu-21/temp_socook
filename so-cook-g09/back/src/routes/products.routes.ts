import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// GET tous les produits
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
});

// GET produit par ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM products WHERE id_product = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
});

// GET produits par vendeur
router.get("/seller/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM products WHERE id_seller = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting products by seller:", error);
    res.status(500).json({ error: "Failed to get products by seller" });
  }
});

// GET produits par catégorie
router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const result = await db.query("SELECT * FROM products WHERE category = $1", [category]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting products by category:", error);
    res.status(500).json({ error: "Failed to get products by category" });
  }
});

export default router;
