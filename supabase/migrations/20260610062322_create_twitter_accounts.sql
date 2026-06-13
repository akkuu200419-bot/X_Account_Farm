CREATE TABLE twitter_accounts (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  ts          text,
  first_name  text    NOT NULL,
  last_name   text    NOT NULL,
  email       text,
  handle      text,
  password    text,
  device      text,
  status      text    NOT NULL DEFAULT 'ok',
  totp_secret text
);

ALTER TABLE twitter_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_accounts" ON twitter_accounts
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_accounts" ON twitter_accounts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_accounts" ON twitter_accounts
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_accounts" ON twitter_accounts
  FOR DELETE TO anon USING (true);
