import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const config = fs.readFileSync('.env.local', 'utf8')
const getEnv = (key) => config.match(new RegExp(`${key}=(.*)`))[1]
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'))

async function run() {
  const { data, error } = await supabase.from('loyalty_members').insert([{
    name: 'Test Member',
    email: 'test@example.com',
    member_id: 'MEM12345678',
    tier: 'Standard',
    points: 500,
    stays: 0,
    status: 'Active',
    join_date: new Date().toISOString().split('T')[0]
  }])
  console.log('Insert Result:', { data, error })
}
run()
