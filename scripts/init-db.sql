-- Включить расширение UUID, если оно еще не включено
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создать таблицу пользователей
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  id_card TEXT,
  postal_code TEXT NOT NULL, -- Discord nickname
  avatar_url TEXT,
  licenses TEXT[], -- Массив строк для лицензий
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создать таблицу заказов
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Хранить массив товаров корзины как JSON
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  telegram_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Дополнительно: Для продакшена рекомендуется настроить политики RLS (Row Level Security)
-- для таблиц users и orders, чтобы обеспечить безопасность данных.
-- Например:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
