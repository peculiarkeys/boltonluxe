import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xztdhgfkasaeusmylrvp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('loyalty_members').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

run();
