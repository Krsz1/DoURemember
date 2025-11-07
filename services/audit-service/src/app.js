import express from "express";
import dotenv from "dotenv";
import auditRoutes from "./routes/auditRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.AUDIT_PORT || 5010;

app.use(express.json());

app.get("/", (_req, res) => res.status(200).send("Audit service running"));
app.use("/api/audits", auditRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`Audit service running on http://localhost:${PORT}`));
