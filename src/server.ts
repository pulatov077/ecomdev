import express from "express";
import path from "path";
import dotenv from "dotenv";
import studentRoutes from "./routes/students";
import paymentRoutes from "./routes/payments";
import debtorRoutes from "./routes/debtors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/debtors", debtorRoutes);

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
