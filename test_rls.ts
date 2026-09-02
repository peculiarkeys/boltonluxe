import { createClient } from '@supabase/supabase-js'

const supabase = createClient('http://localhost:5432', 'anon-key') // wait, I don't have the anon key.
