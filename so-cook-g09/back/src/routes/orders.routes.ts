import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// GET commandes d'un utilisateur
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      "SELECT * FROM orders WHERE id_user = $1 ORDER BY created_at DESC",
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// GET détails d'une commande
router.get("/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const orderResult = await db.query(
      "SELECT * FROM orders WHERE id_order = $1",
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const order = orderResult.rows[0];
    
    const itemsResult = await db.query(
      `SELECT oi.*, p.product_name, p.price, p.image_url
       FROM order_items oi
       JOIN products p ON oi.id_product = p.id_product
       WHERE oi.id_order = $1`,
      [orderId]
    );
    
    res.json({
      order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ error: "Failed to get order details" });
  }
});

// Créer une nouvelle commande
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, items, shippingAddress, totalAmount } = req.body;
    
    // Commencer une transaction
    await db.query("BEGIN");
    
    // Créer la commande
    const orderResult = await db.query(
      "INSERT INTO orders (id_user, total_amount, shipping_address, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [userId, totalAmount, shippingAddress]
    );
    
    const order = orderResult.rows[0];
    
    // Ajouter les articles de la commande
    for (const item of items) {
      await db.query(
        "INSERT INTO order_items (id_order, id_product, quantity, price) VALUES ($1, $2, $3, $4)",
        [order.id_order, item.id_product, item.quantity, item.price]
      );
    }
    
    // Vider le panier de l'utilisateur
    await db.query("DELETE FROM cart_items WHERE id_user = $1", [userId]);
    
    // Valider la transaction
    await db.query("COMMIT");
    
    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await db.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Mettre à jour le statut d'une commande
router.put("/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id_order = $2 RETURNING *",
      [status, orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
