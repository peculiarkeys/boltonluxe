import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data, error } = await supabase.from('loyalty_members').insert([{
    name: 'Test Member',
    email: 'test4@example.com',
    member_id: 'MEM12345678',
    tier: 'Standard',
    points: 500,
    stays: 0,
    status: 'Active',
    join_date: new Date().toISOString().split('T')[0]
  }]).select();
  console.log("Insert result:", { data, error });
}

check();
