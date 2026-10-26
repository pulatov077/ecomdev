export interface Student {
  id: number;
  name: string;
  phone: string;
  group_name: string;
  monthly_amount: number;
  created_at?: string;
}

export interface Payment {
  id: number;
  student_id: number;
  student_name?: string;
  amount: number;
  date: string;
  created_at?: string;
}

export interface Debtor {
  id: number;
  name: string;
  phone: string;
  group_name: string;
  monthly_amount: number;
  paid: number;
  debt: number;
}
