import { neon } from '@neondatabase/serverless';

    // process.env.DATABASE_URL будет автоматически подставлен Vercel
    // при развертывании, или из .env.local файла при локальной разработке.
    const sql = neon(process.env.DATABASE_URL!);

    export default sql;
```    *   **Как это работает**: Когда ваш Next.js приложение развертывается на Vercel, Vercel автоматически подставляет значения переменных окружения, которые вы настроили в Шаге 3, в `process.env`. Таким образом, `process.env.DATABASE_URL` будет содержать вашу строку подключения к Neon.

2.  **`app/actions/profile.ts` и `app/actions/orders.ts` (Использование Neon и Vercel Blob)**:
    Эти файлы содержат Server Actions, которые выполняются на сервере. Они импортируют `sql` из `lib/db.ts` для взаимодействия с Neon и функции `put`, `del` из `@vercel/blob` для работы с хранилищем файлов.
    ```typescript
    // Пример из app/actions/profile.ts
    "use server" // Обязательно для Server Actions

    import sql from "@/lib/db" // Используем наш настроенный клиент Neon
    import { put, del } from "@vercel/blob" // Функции для работы с Vercel Blob
    import { revalidatePath } from "next/cache" // Для обновления кеша Next.js

    // ... (остальной код Server Actions)
