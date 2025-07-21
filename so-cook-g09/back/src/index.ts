import express, { Request, Response } from "express";
import { db } from "./db";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import ordersRoutes from "./routes/orders.routes";
import productsRoutes from "./routes/products.routes";
import sellersRoutes from "./routes/sellers.routes";
import usersRoutes from "./routes/users.routes";

// Middleware
import { errorHandler } from "./middlewares/error";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// CORS middleware
app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellers", sellersRoutes);
app.use("/api/users", usersRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
