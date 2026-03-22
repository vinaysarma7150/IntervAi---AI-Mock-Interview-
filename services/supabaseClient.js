
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://oxgvicxuaemqkxgkvpae.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94Z3ZpY3h1YWVtcWt4Z2t2cGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIzNjQsImV4cCI6MjA4ODcwODM2NH0.Y1FPaLeiDRHacaROLRIoa9AZXDshUS53hAO95iZSibs"
export const supabase = createClient(supabaseUrl, supabaseKey)

