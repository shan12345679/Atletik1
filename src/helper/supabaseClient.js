import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kklijuzereaputmwrhmc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbGlqdXplcmVhcHV0bXdyaG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODMzNDAsImV4cCI6MjA1NzE1OTM0MH0.cGm02hz1IicsuvFwWdBxIRcZ8k5tmgj0EkwI6cStkiE" ; 
  
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
