import { supabase } from "./database";

async function runSeed() {
  console.log("Seeding initial data...");

  await supabase.from("payments").delete().neq("id", 0);
  await supabase.from("students").delete().neq("id", 0);

  const students = [
    { name: "Jasurbek Rahimov", phone: "+998 90 123 45 67", group_name: "Frontend Bootcamp - F1", monthly_amount: 700000 },
    { name: "Dilnoza Ahmedova", phone: "+998 93 541 22 33", group_name: "Python Backend - P3", monthly_amount: 800000 },
    { name: "Sardor Usmonov", phone: "+998 97 712 34 56", group_name: "Frontend Bootcamp - F1", monthly_amount: 700000 },
    { name: "Madina Qodirova", phone: "+998 94 655 88 99", group_name: "Grafik Dizayn - D2", monthly_amount: 600000 },
    { name: "Bobur Mirzayev", phone: "+998 99 888 77 66", group_name: "Python Backend - P3", monthly_amount: 800000 },
    { name: "Shahzoda Karimova", phone: "+998 91 234 56 78", group_name: "IELTS Intensive - I5", monthly_amount: 900000 },
    { name: "Ulug'bek Tursunov", phone: "+998 90 987 65 43", group_name: "Frontend Bootcamp - F1", monthly_amount: 700000 },
    { name: "Nodira Aliyeva", phone: "+998 93 333 44 55", group_name: "SMM & Target - S1", monthly_amount: 550000 },
  ];

  const { data: insertedStudents, error: sErr } = await supabase.from("students").insert(students).select();
  if (sErr || !insertedStudents) {
    console.error("Failed to seed students:", sErr?.message);
    process.exit(1);
  }

  const map: Record<string, number> = {};
  insertedStudents.forEach((s) => { map[s.name] = s.id; });

  const payments = [
    { student_id: map["Jasurbek Rahimov"], amount: 700000, date: "2026-10-04" },
    { student_id: map["Dilnoza Ahmedova"], amount: 500000, date: "2026-10-07" },
    { student_id: map["Madina Qodirova"], amount: 300000, date: "2026-10-05" },
    { student_id: map["Madina Qodirova"], amount: 300000, date: "2026-10-18" },
    { student_id: map["Bobur Mirzayev"], amount: 400000, date: "2026-10-10" },
    { student_id: map["Shahzoda Karimova"], amount: 900000, date: "2026-10-03" },
    { student_id: map["Ulug'bek Tursunov"], amount: 250000, date: "2026-10-12" },
  ];

  const { error: pErr } = await supabase.from("payments").insert(payments);
  if (pErr) {
    console.error("Failed to seed payments:", pErr.message);
    process.exit(1);
  }

  console.log("Database seeded successfully with 8 students and 7 payments.");
}

runSeed();
