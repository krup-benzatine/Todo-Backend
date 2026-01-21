import "dotenv/config";
import express from "express";
import { DBconnection } from "./src/db";
import authRoutes from "./src/routes/auth.routes";
import taskRoutes from "./src/routes/task.routes";
import pmsRoutes from "./src/routes/pms.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
const port = 9000;

DBconnection();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: true, // Allow any origin in development or match specific URLs
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/pms", pmsRoutes);

app.listen(port, () => {
  return console.log(`Server Chal raha he `);
});
