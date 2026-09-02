with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'r') as f:
    content = f.read()

# fix the broken line
content = content.replace("IF v_johnwood_id IS NULL OR v_bwh_id IS NULL OR  IF v_uid IS NULL THEN\n    PERFORM pg_sleep(1.1);\n    v_uid := gen_random_uuid();EXCEPTION 'Properties must be seeded first.';", "IF v_johnwood_id IS NULL OR v_bwh_id IS NULL OR v_bwr_id IS NULL THEN\n    RAISE EXCEPTION 'Properties must be seeded first.';")

content = content.replace("  IF v_uid IS NULL THEN\n    v_uid := gen_random_uuid();", "  IF v_uid IS NULL THEN\n    PERFORM pg_sleep(1.1);\n    v_uid := gen_random_uuid();")

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'w') as f:
    f.write(content)
