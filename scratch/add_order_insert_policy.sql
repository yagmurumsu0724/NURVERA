-- Sipariş ekleme yetkisi
CREATE POLICY "Kullanıcı sipariş ekleyebilir" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'anon');
