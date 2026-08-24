import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data: m, error: me } = await supabase.from('loyalty_point_transactions').select('*');
  console.log("Txns length:", m?.length);
  const { data: l, error: le } = await supabase.from('leads').select('*');
  console.log("Leads length:", l?.length);
}
check();
