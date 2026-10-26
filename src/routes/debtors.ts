import { Router, Request, Response } from "express";
import { supabase } from "../database";

const router = Router();

// GET /api/debtors?month=YYYY-MM — oylik qarzdorlar ro'yxati
router.get("/", async (req: Request, res: Response) => {
  try {
    let month = req.query.month as string;

    // Agar oy ko'rsatilmasa — joriy oy
    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    // Format tekshirish: YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "month formati YYYY-MM bo'lishi kerak" });
    }

    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const mon = parseInt(monthStr, 10);
    const startDate = `${month}-01`;
    const lastDay = new Date(year, mon, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    // 1. Barcha o'quvchilarni olish
    const { data: students, error: studentError } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (studentError) {
      console.error("Supabase error (students for debtors):", studentError);
      return res.status(500).json({ error: studentError.message });
    }

    // 2. Shu oydagi to'lovlarni olish
    const { data: payments, error: paymentError } = await supabase
      .from("payments")
      .select("student_id, amount, date")
      .gte("date", startDate)
      .lte("date", endDate);

    if (paymentError) {
      console.error("Supabase error (payments for debtors):", paymentError);
      return res.status(500).json({ error: paymentError.message });
    }

    // 3. Har bir o'quvchining shu oydagi to'lagan summasini jamlash
    const paidByStudent = new Map<number, number>();
    for (const p of payments || []) {
      const sid = Number(p.student_id);
      const current = paidByStudent.get(sid) || 0;
      paidByStudent.set(sid, current + Number(p.amount));
    }

    // 4. Qarzdorlarni aniqlash (oylik summa - to'langan > 0)
    const debtors = [];
    for (const s of students || []) {
      const monthlyAmount = Number(s.monthly_amount);
      const paid = paidByStudent.get(Number(s.id)) || 0;
      const debt = monthlyAmount - paid;

      if (debt > 0) {
        debtors.push({
          id: s.id,
          name: s.name,
          phone: s.phone,
          group_name: s.group_name,
          monthly_amount: monthlyAmount,
          paid,
          debt,
        });
      }
    }

    // 5. Qarz bo'yicha kamayish tartibida saralash
    debtors.sort((a, b) => b.debt - a.debt);

    res.json(debtors);
  } catch (err: any) {
    console.error("Debtors calculation error:", err);
    res.status(500).json({ error: err.message || "Server xatosi" });
  }
});

export default router;
