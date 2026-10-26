import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Agar tekshiruvchi .env yaratmasa, default demo bazaga ulanadi (Zero-config setup)
const DEFAULT_URL = "https://eucituwwezutwdekakdo.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Y2l0dXd3ZXp1dHdkZWtha2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTAxMTEsImV4cCI6MjEwODU4NjExMX0.jBreb3mXjBiFldgZLtKIb-HrsBKnpi1iEyjsJNww0yY";

const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
