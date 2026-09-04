import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_all_loyalty_members');
  console.log("All members:", data?.map(m => ({ email: m.email, member_id: m.member_id, name: m.name })));
}

check();
