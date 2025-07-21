import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// GET utilisateur par ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT id_user, name, email, created_at FROM users WHERE id_user = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Mettre à jour les informations d'un utilisateur
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email) {
      const emailCheck = await db.query(
        "SELECT * FROM users WHERE email = $1 AND id_user != $2",
        [email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: "Cette adresse email est déjà utilisée" });
      }
    }
    
    const result = await db.query(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id_user = $3 RETURNING id_user, name, email",
      [name, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Mettre à jour le mot de passe d'un utilisateur
router.put("/:id/password", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Vérifier le mot de passe actuel
    const userCheck = await db.query(
      "SELECT * FROM users WHERE id_user = $1",
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const user = userCheck.rows[0];
    
    // Dans une vraie application, on comparerait le hash du mot de passe
    if (currentPassword !== user.password) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Mettre à jour le mot de passe (dans une vraie app, on hasherait le nouveau mot de passe)
    await db.query(
      "UPDATE users SET password = $1 WHERE id_user = $2",
      [newPassword, id]
    );
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

export default router;
