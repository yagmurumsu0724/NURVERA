-- Kullanıcıların kendi siparişlerini görebilmesi için güvenlik izni
CREATE POLICY "Kullanıcı kendi siparişlerini görebilir" ON orders
  FOR SELECT USING (auth.uid() = user_id);
