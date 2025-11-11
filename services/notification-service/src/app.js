const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const notificationRoutes = require("./routes/notificationRoutes");
const { startScheduler } = require("./services/schedulerService");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Notification Service corriendo en el puerto ${PORT}`);
  startScheduler();
});
