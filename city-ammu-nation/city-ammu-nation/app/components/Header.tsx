import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-red-600">City Ammu-Nation</Link>
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:text-red-600">Главная</Link></li>
          <li><Link href="/catalog" className="hover:text-red-600">Каталог</Link></li>
          <li><Link href="/licensing" className="hover:text-red-600">Лицензирование</Link></li>
          <li><Link href="/shooting-range" className="hover:text-red-600">Тир</Link></li>
        </ul>
      </nav>
    </header>
  )
}

