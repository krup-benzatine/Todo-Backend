import express from "express";
import { DBconnection } from "./src/db";
import authRoutes from "./src/routes/auth.routes";
import taskRoutes from "./src/routes/task.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
const port = 8080;

DBconnection();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.listen(port, () => {
  return console.log(`Server Chal raha he `);
});
