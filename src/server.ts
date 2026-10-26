import express from "express";
import path from "path";
import dotenv from "dotenv";
import studentRoutes from "./routes/students";
import paymentRoutes from "./routes/payments";
import debtorRoutes from "./routes/debtors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend static fayllari (Vue.js SPA)
app.use(express.static(path.join(__dirname, "..", "public")));

// API routerlar
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/debtors", debtorRoutes);

// SPA fallback — barcha boshqa sahifalar index.html ga yo'naltiriladi
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`📡 Supabase: ${process.env.SUPABASE_URL ? "Ulangan" : "⚠️ .env da sozlanmagan"}`);
});
