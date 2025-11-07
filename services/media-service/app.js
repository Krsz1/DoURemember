import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mediaRoutes from "./src/routes/mediaRoutes.js";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploads statically so local fallback files are accessible
app.use('/uploads', express.static(uploadsDir));

app.use("/api/media", mediaRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`✅ Media-service running on port ${PORT}`));
