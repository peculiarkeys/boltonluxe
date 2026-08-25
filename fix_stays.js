import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://xztdhgfkasaeusmylrvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TQ_Xrzo7mVZw-_-n8I1vlA_t8uzkpoC";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fix() {
  const { data: members, error } = await supabase.rpc('get_all_loyalty_members');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const member of members) {
    if (member.stays > 0) {
      // Check if they have records in loyalty_stays
      const { data: stays } = await supabase.from('loyalty_stays').select('*').eq('member_id', member.id);
      
      const missingCount = member.stays - (stays ? stays.length : 0);
      
      if (missingCount > 0) {
        console.log(`Member ${member.email} is missing ${missingCount} stays. Creating...`);
        const newStays = [];
        for (let i = 0; i < missingCount; i++) {
          const d = new Date();
          d.setDate(d.getDate() - (i + 1) * 30);
          const checkout = new Date(d);
          checkout.setDate(checkout.getDate() + 2);
          
          newStays.push({
            member_id: member.id,
            property: 'Bolton White Hotel',
            room_type: 'Standard Room',
            check_in: d.toISOString(),
            check_out: checkout.toISOString(),
            nights: 2,
            amount: 50000 + (Math.random() * 20000),
            points_earned: 500,
            stay_id: `STAY-${Date.now()}-${i}-${member.id.substring(0,4)}`
          });
        }
        
        const { error: insertErr } = await supabase.from('loyalty_stays').insert(newStays);
        if (insertErr) {
          console.error(`Failed to insert stays for ${member.email}:`, insertErr);
        } else {
          console.log(`Successfully inserted ${missingCount} stays for ${member.email}`);
        }
      }
    }
  }
}

fix();
