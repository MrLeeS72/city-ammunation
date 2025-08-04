"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { testDbConnection } from "@/app/actions/db-test" // Импортируем наш Server Action

export default function DbConnectionTest() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestConnection = () => {
    setResult(null) // Сбрасываем предыдущий результат
    startTransition(async () => {
      const res = await testDbConnection()
      setResult(res)
    })
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
        <Terminal className="mr-2 h-6 w-6 text-red-600" />
        Проверка подключения к базе данных
      </h2>
      <p className="mb-4 text-gray-600">
        Нажмите кнопку ниже, чтобы проверить, может ли ваше приложение подключиться к базе данных Neon.
      </p>
      <Button
        onClick={handleTestConnection}
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Проверка...
          </>
        ) : (
          "Проверить подключение"
        )}
      </Button>

      {result && (
        <Alert className={`mt-4 ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
            {result.success ? "Успех!" : "Ошибка!"}
          </AlertTitle>
          <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
