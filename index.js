import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getSummary, getSummaryWithImages } from "./handlers/openAI.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Hello" });
});

app.post("/api/summary", getSummary);

app.post("/api/images", getSummaryWithImages);

app.listen(8000, () => {
  console.log("Sever listening on 8000");
});

export default app;
