import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://todkakvcgijsedyrqinj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZGtha3ZjZ2lqc2VkeXJxaW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTc1OTcsImV4cCI6MjA3NDA5MzU5N30.I0Qy4xbIl82LO2zgd_YO3AICcX9yT-42T2z5t4WznyM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
