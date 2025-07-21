import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Étendre l'interface Request pour inclure userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Interface pour le payload du JWT
interface JwtPayload {
  userId: string;
  [key: string]: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    res.status(500).json({ error: "Configuration serveur incorrecte" });
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "Token d'accès requis" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Vérifier que userId existe dans le payload
    if (!decoded.userId) {
      res.status(401).json({ error: "Token invalide: userId manquant" });
      return;
    }
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expiré" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token invalide" });
      return;
    }
    res.status(500).json({ error: "Erreur lors de la vérification du token" });
  }
};
