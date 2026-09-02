import re

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'r') as f:
    content = f.read()

# Remove PERFORM pg_sleep(1.1);
content = content.replace('    PERFORM pg_sleep(1.1);\n', '')

# We will split on the dashed lines
# -- ---------------------------------------------------------
# -- [Property] Admin [N]: [Role]
# -- ---------------------------------------------------------

header = content.split('-- ---------------------------------------------------------')[0]
footer = content.split('END $$;')[1]

blocks = re.split(r'-- -{57}\n-- (.*?)\n-- -{57}\n', content)

new_content = header

for i in range(1, len(blocks), 2):
    title = blocks[i]
    body = blocks[i+1]
    
    # create a new DO block for each
    new_content += f"""
DO $$
DECLARE
  v_johnwood_id uuid;
  v_bwh_id uuid;
  v_bwr_id uuid;
  v_uid uuid;
  v_email text;
  v_password text;
  v_role text;
BEGIN
  SELECT id INTO v_johnwood_id FROM public.properties WHERE code = 'JOHNWOOD';
  SELECT id INTO v_bwh_id FROM public.properties WHERE code = 'BWH';
  SELECT id INTO v_bwr_id FROM public.properties WHERE code = 'BWR';

  -- ---------------------------------------------------------
  -- {title}
  -- ---------------------------------------------------------
{body}
END $$;
"""

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'w') as f:
    f.write(new_content)
