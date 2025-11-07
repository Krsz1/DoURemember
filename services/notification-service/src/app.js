import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes.js";
import { startScheduler } from "./services/schedulerService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Notification Service corriendo en el puerto ${PORT}`);
  startScheduler();
});
