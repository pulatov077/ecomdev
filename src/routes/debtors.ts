import { Router, Request, Response } from "express";
import { supabase } from "../database";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    let month = req.query.month as string;

    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "month parametri YYYY-MM formatida bo'lishi kerak" });
    }

    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const mon = parseInt(monthStr, 10);
    const startDate = `${month}-01`;
    const lastDay = new Date(year, mon, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    const [studentsResult, paymentsResult] = await Promise.all([
      supabase.from("students").select("*").order("id", { ascending: true }),
      supabase.from("payments").select("student_id, amount, date").gte("date", startDate).lte("date", endDate),
    ]);

    if (studentsResult.error) {
      return res.status(500).json({ error: studentsResult.error.message });
    }
    if (paymentsResult.error) {
      return res.status(500).json({ error: paymentsResult.error.message });
    }

    const paidByStudent = new Map<number, number>();
    for (const payment of paymentsResult.data ?? []) {
      const sid = Number(payment.student_id);
      const prev = paidByStudent.get(sid) ?? 0;
      paidByStudent.set(sid, prev + Number(payment.amount));
    }

    const debtors = [];
    for (const student of studentsResult.data ?? []) {
      const monthlyAmount = Number(student.monthly_amount);
      const paid = paidByStudent.get(Number(student.id)) ?? 0;
      const debt = monthlyAmount - paid;

      if (debt > 0) {
        debtors.push({
          id: student.id,
          name: student.name,
          phone: student.phone,
          group_name: student.group_name,
          monthly_amount: monthlyAmount,
          paid,
          debt,
        });
      }
    }

    debtors.sort((a, b) => b.debt - a.debt);

    res.json(debtors);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

export default router;
