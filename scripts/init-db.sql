-- Включить расширение UUID, если оно еще не включено
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создать таблицу пользователей
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstName TEXT NOT NULL, -- Changed from first_name
  lastName TEXT NOT NULL,  -- Changed from last_name
  phone TEXT UNIQUE NOT NULL,
  idCard TEXT,
  postalCode TEXT, -- Changed from postal_code (Discord nickname)
  avatar_url TEXT, -- Kept as snake_case for DB
  licenses TEXT[], -- Массив строк для лицензий
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Changed from created_at
);

-- Создать таблицу заказов
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Changed from user_id
  items JSONB NOT NULL, -- Хранить массив товаров корзины как JSON
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  telegramMessageId TEXT, -- Changed from telegram_message_id
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Changed from created_at
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
