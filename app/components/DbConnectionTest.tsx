"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { testDbConnection } from "@/lib/api" // Импортируем Server Action

export function DbConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const handleTestConnection = async () => {
    setStatus("loading")
    setMessage(null)
    try {
      const result = await testDbConnection()
      if (result.success) {
        setStatus("success")
        setMessage(result.message)
      } else {
        setStatus("error")
        setMessage(result.message)
      }
    } catch (err: any) {
      setStatus("error")
      setMessage(`Непредвиденная ошибка при проверке: ${err.message || "Неизвестная ошибка"}`)
      console.error("Error during DB connection test:", err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-red-600">Проверка подключения к базе данных</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button onClick={handleTestConnection} disabled={status === "loading"} className="bg-red-600 hover:bg-red-700">
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Проверка...
            </>
          ) : (
            "Проверить подключение"
          )}
        </Button>
        {status !== "idle" && message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md w-full ${
              status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <p className="text-sm">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
