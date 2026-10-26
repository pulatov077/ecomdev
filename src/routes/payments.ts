import { Router, Request, Response } from "express";
import { supabase } from "../database";

const router = Router();

// POST /api/payments — yangi to'lov qo'shish
router.post("/", async (req: Request, res: Response) => {
  try {
    const { student_id, amount, date } = req.body;

    if (!student_id || amount === undefined || Number(amount) <= 0 || !date) {
      return res
        .status(400)
        .json({ error: "student_id, amount (>0) va date majburiy" });
    }

    // Sana formatini tekshirish (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "date formati YYYY-MM-DD bo'lishi kerak" });
    }

    // O'quvchi mavjudligini tekshirish
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, name")
      .eq("id", student_id)
      .maybeSingle();

    if (studentError || !student) {
      return res.status(404).json({ error: "O'quvchi topilmadi" });
    }

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          student_id: Number(student_id),
          amount: Number(amount),
          date,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error (create payment):", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server xatosi" });
  }
});

// GET /api/payments/student/:id — o'quvchining to'lovlari ro'yxati
router.get("/student/:id", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        id,
        student_id,
        amount,
        date,
        created_at,
        students:student_id (
          name
        )
      `)
      .eq("student_id", req.params.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error (list payments by student):", error);
      return res.status(500).json({ error: error.message });
    }

    const result = (data || []).map((p: any) => ({
      id: p.id,
      student_id: p.student_id,
      student_name: p.students?.name || "Noma'lum",
      amount: Number(p.amount),
      date: p.date,
      created_at: p.created_at,
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server xatosi" });
  }
});

export default router;
