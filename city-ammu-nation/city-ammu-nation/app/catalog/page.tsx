import Header from '../components/Header'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

const weaponCategories = [
  {
    name: "Free sale Without license",
    items: [
      { name: "Flick knife", price: 300, image: "/images/flick-knife.jpg" },
      { name: "Army knife M9", price: 580, image: "/images/army-knife-m9.jpg" },
      { name: "Cavalry dagger", price: 400, image: "/images/cavalry-dagger.jpg" },
      { name: "Machete", price: 620, image: "/images/machete.jpg" },
      { name: "Brass knuckles", price: 90, image: "/images/brass-knuckles.jpg" },
      { name: "Baseball-bat", price: 90, image: "/images/baseball-bat.jpg" },
      { name: "Golf hockey stick", price: 320, image: "/images/golf-hockey-stick.jpg" },
      { name: "Billiard cue", price: 70, image: "/images/billiard-cue.jpg" },
      { name: "Hammer", price: 180, image: "/images/hammer.jpg" },
      { name: "Pinch-bar", price: 470, image: "/images/pinch-bar.jpg" },
      { name: "Adjustable spanner", price: 380, image: "/images/adjustable-spanner.jpg" },
      { name: "Flashlight", price: 80, image: "/images/flashlight.jpg" },
      { name: "Axe", price: 300, image: "/images/axe.jpg" },
      { name: "Battle Axe", price: 400, image: "/images/battle-axe.jpg" },
      { name: "Extinguisher", price: 700, image: "/images/extinguisher.jpg" },
      { name: "Fire extinguisher refill", price: 105, image: "/images/fire-extinguisher-refill.jpg" },
      { name: "Jerrycan", price: 50, image: "/images/jerrycan.jpg" },
    ]
  },
  {
    name: 'Category "9mm"',
    items: [
      { name: "Pocket pistol", price: 1520, ammo: "Патроны 12шт/36$", image: "/images/pocket-pistol.jpg" },
      { name: "BERETTA M9", price: 2700, ammo: "Патроны 12шт/36$", image: "/images/beretta-m9.jpg" },
      { name: "SIG Sauer P250", price: 4200, ammo: "Патроны 12шт/36$", image: "/images/sig-sauer-p250.jpg" },
      { name: "Glock - 17", price: 5250, ammo: "Патроны 12шт/36$", image: "/images/glock-17.jpg" },
      { name: "Vintage pistol", price: 5700, ammo: "Патроны 12шт/36$", image: "/images/vintage-pistol.jpg" },
      { name: "ORION FLARE GUN", price: 2250, ammo: "Патроны 12шт/90$", image: "/images/orion-flare-gun.jpg" },
    ]
  },
  {
    name: 'Category "A"',
    items: [
      { name: "DESERT EAGLE", price: 10200, ammo: "Патроны 12шт/36$", image: "/images/desert-eagle.jpg" },
      { name: "REVOLVER", price: 30000, ammo: "Патроны 12шт/36$", image: "/images/revolver.jpg" },
      { name: "REVOLVER MK II", price: 37000, ammo: "Патроны 12шт/36$", image: "/images/revolver-mk-ii.jpg" },
      { name: "GOLD REVOLVER", price: 50000, ammo: "Патроны 12шт/36$", image: "/images/gold-revolver.jpg" },
    ]
  },
  {
    name: 'Category "B"',
    items: [
      { name: "MOSSBERG 590 A1", price: 15000, ammo: "Патроны 12шт/48$", image: "/images/mossberg-590-a1.jpg" },
      { name: "Sawed-off shotgun", price: 7000, ammo: "Патроны 12шт/48$", image: "/images/sawed-off-shotgun.jpg" },
      { name: "Flintlock rifle", price: 4500, ammo: "Патроны 12шт/48$", image: "/images/flintlock-rifle.jpg" },
      { name: "CONTENDER", price: 5500, ammo: "Патроны 12шт/48$", image: "/images/contender.jpg" },
    ]
  },
  {
    name: 'Category "C"',
    items: [
      { name: "TEC-9", price: 13000, ammo: "Патроны 12шт/48$", image: "/images/tec-9.jpg" },
      { name: "SKORPION", price: 16500, ammo: "Патроны 12шт/48$", image: "/images/skorpion.jpg" },
      { name: "FN P90", price: 15500, ammo: "Патроны 12шт/48$", image: "/images/fn-p90.jpg" },
      { name: "MP5", price: 15200, ammo: "Патроны 12шт/48$", image: "/images/mp5.jpg" },
      { name: "SGW Suppressor", price: 20200, ammo: "Патроны 12шт/48$", image: "/images/sgw-suppressor.jpg" },
      { name: "MP5 MKII", price: 23000, ammo: "Патроны 12шт/48$", image: "/images/mp5-mkii.jpg" },
      { name: "THOMPSON", price: 19250, ammo: "Патроны 12шт/48$", image: "/images/thompson.jpg" },
    ]
  },
  {
    name: 'Category "D"',
    items: [
      { name: "AR-15/TX-15", price: 90000, ammo: "Патроны 12шт/48$", image: "/images/ar-15-tx-15.jpg" },
      { name: "AK", price: 32900, ammo: "Патроны 12шт/48$", image: "/images/ak.jpg" },
      { name: "Bullpup Rifle", price: 34000, ammo: "Патроны 12шт/48$", image: "/images/bullpup-rifle.jpg" },
      { name: "HK G36", price: 35000, ammo: "Патроны 12шт/48$", image: "/images/hk-g36.jpg" },
      { name: "TAR-21", price: 35000, ammo: "Патроны 12шт/48$", image: "/images/tar-21.jpg" },
      { name: "AKSU", price: 36000, ammo: "Патроны 12шт/48$", image: "/images/aksu.jpg" },
      { name: "HK G36 MKII", price: 39000, ammo: "Патроны 12шт/48$", image: "/images/hk-g36-mkii.jpg" },
      { name: "M4 A1", price: 33000, ammo: "Патроны 12шт/48$", image: "/images/m4-a1.jpg" },
    ]
  },
]

export default function Catalog() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-lg"
            asChild
          >
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSc8rM6_-p5z7AtCis2nND5fOiWxWTdy4us7FRN9HOTUHxbNnQ/viewform" target="_blank" rel="noopener noreferrer">
              Оформить заказ
            </a>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-red-600">Каталог оружия</h1>
        {weaponCategories.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white p-4 rounded-lg shadow-md">
                  <Image 
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">Цена: ${item.price}</p>
                  {item.ammo && <p className="text-gray-500 mb-4">{item.ammo}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2023 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}

