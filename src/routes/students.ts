import { Router, Request, Response } from "express";
import { supabase } from "../database";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data ?? []);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, phone, group_name, monthly_amount } = req.body;

    if (!name || !phone || !group_name || monthly_amount === undefined || Number(monthly_amount) <= 0) {
      return res.status(400).json({
        error: "Maydonlar to'liq va monthly_amount musbat son bo'lishi shart",
      });
    }

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          name: String(name).trim(),
          phone: String(phone).trim(),
          group_name: String(group_name).trim(),
          monthly_amount: Number(monthly_amount),
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

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, phone, group_name, monthly_amount } = req.body;

    if (!name || !phone || !group_name || monthly_amount === undefined || Number(monthly_amount) <= 0) {
      return res.status(400).json({
        error: "Maydonlar to'liq va monthly_amount musbat son bo'lishi shart",
      });
    }

    const { data, error } = await supabase
      .from("students")
      .update({
        name: String(name).trim(),
        phone: String(phone).trim(),
        group_name: String(group_name).trim(),
        monthly_amount: Number(monthly_amount),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "O'quvchi topilmadi" });
    }

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: "O'quvchi o'chirildi" });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
});

export default router;
