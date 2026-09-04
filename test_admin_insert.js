import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'johnwood.generalmanager@boltonhq.com',
    password: 'P$8vKx!2mQc#9L'
  });
  if (authErr) {
    console.log("Auth err:", authErr.message);
    return;
  }
  
  const { data, error } = await supabase.from('loyalty_members').insert([{
    name: 'Admin Test Member',
    email: 'admintest@example.com',
    member_id: 'MEM88888888',
    tier: 'Standard',
    points: 500,
    stays: 0,
    status: 'Active',
    join_date: new Date().toISOString().split('T')[0]
  }]).select();
  console.log("Admin insert result:", { data, error });
}
run();
