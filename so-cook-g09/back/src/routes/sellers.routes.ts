import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// GET tous les vendeurs
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM sellers");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting sellers:", error);
    res.status(500).json({ error: "Failed to get sellers" });
  }
});

// GET vendeur par ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM sellers WHERE id_seller = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Seller not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting seller:", error);
    res.status(500).json({ error: "Failed to get seller" });
  }
});

// GET vendeurs à proximité d'une position
router.get("/nearby/:lat/:lng/:distance", async (req: Request, res: Response) => {
  try {
    const { lat, lng, distance } = req.params;
    
    // Cette requête utilise la formule haversine pour calculer la distance
    const result = await db.query(
      `SELECT 
        s.*, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - 
        radians($2)) + sin(radians($1)) * sin(radians(latitude)))) AS distance 
      FROM 
        sellers s 
      HAVING 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - 
        radians($2)) + sin(radians($1)) * sin(radians(latitude)))) < $3 
      ORDER BY 
        distance
      `,
      [parseFloat(lat), parseFloat(lng), parseFloat(distance)]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting nearby sellers:", error);
    res.status(500).json({ error: "Failed to get nearby sellers" });
  }
});

export default router;
