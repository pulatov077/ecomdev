import { Router, Request, Response } from "express";
import { supabase } from "../database";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { student_id, amount, date } = req.body;

    if (!student_id || amount === undefined || Number(amount) <= 0 || !date) {
      return res.status(400).json({
        error: "student_id, amount (>0) va date kiritilishi shart",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Sana YYYY-MM-DD formatida bo'lishi kerak" });
    }

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
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
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

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
        students:student_id ( name )
      `)
      .eq("student_id", req.params.id)
      .order("date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formatted = (data ?? []).map((item: any) => ({
      id: item.id,
      student_id: item.student_id,
      student_name: item.students?.name ?? "Noma'lum",
      amount: Number(item.amount),
      date: item.date,
      created_at: item.created_at,
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

export default router;
