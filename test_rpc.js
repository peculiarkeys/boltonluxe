import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_all_loyalty_members');
  if (data?.length > 0) {
    console.log("Members with stays > 0:", data.filter(m => m.stays > 0).map(m => ({ email: m.email, stays: m.stays })));
  }
  if (error) console.error(error);
}

check();
