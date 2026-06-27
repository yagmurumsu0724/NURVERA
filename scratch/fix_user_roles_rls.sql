-- Kullanıcıların kendi rollerini görebilmesi için güvenlik izni
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON user_roles;
CREATE POLICY "Kullanıcılar kendi rollerini görebilir" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);
