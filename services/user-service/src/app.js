import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.USERS_PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => res.status(200).send("User service running"));

app.use("/api/users", userRoutes);

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'user-service' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`User service running on http://localhost:${PORT}`));
