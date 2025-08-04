import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "./components/Header"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8">
        <div className="relative w-full max-w-4xl mx-auto mb-8">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="Ammu-Nation Store Front"
            width={800}
            height={400}
            className="rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Добро пожаловать в Ammu-Nation</h1>
          </div>
        </div>

        <p className="text-lg text-gray-700 mb-8 max-w-2xl">
          Ваш надежный поставщик оружия и боеприпасов в Лос-Сантосе. У нас вы найдете все необходимое для самообороны,
          охоты и активного отдыха.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-lg shadow-md">
            <Link href="/catalog">Каталог оружия</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-red-600 text-red-600 hover:bg-red-50 text-lg px-6 py-3 rounded-lg shadow-md"
          >
            <Link href="/shooting-range">Тир</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-red-600 text-red-600 hover:bg-red-50 text-lg px-6 py-3 rounded-lg shadow-md"
          >
            <Link href="/licensing">Лицензирование</Link>
          </Button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
