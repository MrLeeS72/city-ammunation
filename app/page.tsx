import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./components/Header"
import Image from "next/image"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    City Ammu-Nation: Ваша безопасность - наш приоритет
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    Мы предлагаем широкий ассортимент огнестрельного оружия, боеприпасов и аксессуаров для самообороны,
                    охоты и спортивной стрельбы.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-700 disabled:pointer-events-none disabled:opacity-50"
                    href="/catalog"
                  >
                    Перейти в каталог
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="/contacts"
                  >
                    Связаться с нами
                  </Link>
                </div>
              </div>
              <Image
                alt="Hero"
                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover lg:aspect-[4/3]"
                height="400"
                src="/placeholder.png?height=400&width=600"
                width="600"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Наши услуги</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Больше, чем просто магазин оружия</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Мы предлагаем полный спектр услуг, чтобы удовлетворить все ваши потребности в области оружия.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Широкий ассортимент</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    От пистолетов до винтовок, от боеприпасов до аксессуаров - у нас есть все, что вам нужно.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link className="text-red-600 hover:underline" href="/catalog">
                    Посмотреть каталог
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Тир</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Отточите свои навыки стрельбы в нашем современном тире под руководством опытных инструкторов.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link className="text-red-600 hover:underline" href="/shooting-range">
                    Записаться в тир
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Оформление лицензий</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Мы поможем вам с процессом получения всех необходимых лицензий на оружие.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link className="text-red-600 hover:underline" href="/licensing">
                    Узнать больше
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Найдите нас на карте Лос-Сантоса</h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed">
                  Наш магазин удобно расположен в самом сердце города.
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  alt="Los Santos Map"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="400"
                  src="/images/los-santos-detailed-map.png"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-800 text-white">
        <p className="text-xs text-gray-400">&copy; 2025 City Ammu-Nation. Все права защищены.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="/contacts">
            Контакты
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="/vacancies">
            Вакансии
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="/licensing">
            Лицензирование
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="/shooting-range">
            Тир
          </Link>
        </nav>
      </footer>
    </div>
  )
}
