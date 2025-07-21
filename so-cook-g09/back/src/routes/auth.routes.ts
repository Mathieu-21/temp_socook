import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const PEPPER = process.env.PEPPER;

// Vérifier que les variables d'environnement sont définies
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

if (!PEPPER) {
  throw new Error("PEPPER must be defined in environment variables");
}

const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const hashPassword = (password: string, salt: string): string => {
  const passwordWithPepper = password + PEPPER;
  return bcrypt.hashSync(passwordWithPepper, `$2b$01$${salt}`);
};

const verifyPassword = (password: string, hashedPassword: string, salt: string): boolean => {
  const passwordWithPepper = password + PEPPER;
  // Reconstruire le hash avec le même salt pour comparer
  const bcryptSalt = `$2b$01$${salt}`;
  const testHash = bcrypt.hashSync(passwordWithPepper, bcryptSalt);
  return testHash === hashedPassword;
};

// Fonction pour générer un token JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "24h" });
};

const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { first_name, last_name, email, password } = req.body;
  
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ 
      error: "Tous les champs sont requis (first_name, last_name, email, password)" 
    });
  }
  
  // Validation basique de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format d'email invalide" });
  }
  
  // Validation du mot de passe
  if (password.length < 8) {
    return res.status(400).json({ 
      error: "Le mot de passe doit contenir au moins 8 caractères" 
    });
  }
  
  next();
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: "Email et mot de passe sont requis" 
    });
  }
  
  next();
};

// Route de login
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Rechercher l'utilisateur par email avec password et salt
    const result = await db.query(
      "SELECT id_user, password, salt FROM ref_users WHERE email = $1", 
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    
    const user = result.rows[0];

    const isPasswordValid = verifyPassword(password, user.password, user.salt);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = generateToken(user.id_user);
    
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route d'inscription
router.post("/register", validateRegistration, async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    
    // Vérifier si l'email existe déjà
    const emailCheck = await db.query("SELECT id_user FROM ref_users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Cette adresse email est déjà utilisée" });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const userId = uuidv4();

    const insertUserQuery = `
      INSERT INTO ref_users (id_user, first_name, last_name, email, password, salt, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_user
    `;

    const insertValues = [
      userId,
      first_name,
      last_name,
      email,
      hashedPassword,
      salt,
      new Date().toISOString()
    ];
    
    const insertResult = await db.query(insertUserQuery, insertValues);

    if (insertResult.rows.length === 0) {
      return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
    
    const token = generateToken(userId);
    
    res.status(201).json({ token });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default router;
