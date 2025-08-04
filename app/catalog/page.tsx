"use client"

import { useState } from "react"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import WeaponTooltip from "../components/WeaponTooltip"
import { useCart } from "../contexts/CartContext"
import { ShoppingCart } from "lucide-react"

const weapons = [
  {
    id: "revolver",
    name: "Револьвер",
    image: "/public/images/revolver.png",
    description: "Классический револьвер, надежный и мощный.",
    price: 1500,
    category: "Пистолеты",
    damage: 70,
    fireRate: 20,
    accuracy: 60,
    range: 50,
  },
  {
    id: "desert-eagle",
    name: "Desert Eagle",
    image: "/public/images/desert-eagle.png",
    description: "Легендарный пистолет с огромной останавливающей силой.",
    price: 2500,
    category: "Пистолеты",
    damage: 85,
    fireRate: 25,
    accuracy: 65,
    range: 55,
  },
  {
    id: "revolver-mk-ii",
    name: "Револьвер Mk II",
    image: "/public/images/revolver-mk-ii.png",
    description: "Модернизированная версия револьвера с улучшенными характеристиками.",
    price: 2000,
    category: "Пистолеты",
    damage: 75,
    fireRate: 22,
    accuracy: 62,
    range: 52,
  },
  {
    id: "gold-revolver",
    name: "Золотой Револьвер",
    image: "/public/images/gold-revolver.png",
    description: "Эксклюзивный револьвер с золотым покрытием, для ценителей роскоши.",
    price: 5000,
    category: "Пистолеты",
    damage: 70,
    fireRate: 20,
    accuracy: 60,
    range: 50,
  },
  {
    id: "glock-17",
    name: "Glock 17",
    image: "/public/images/glock-17.png",
    description: "Надежный и популярный полуавтоматический пистолет.",
    price: 1200,
    category: "Пистолеты",
    damage: 55,
    fireRate: 40,
    accuracy: 70,
    range: 45,
  },
  {
    id: "vintage-pistol",
    name: "Винтажный Пистолет",
    image: "/public/images/vintage-pistol.png",
    description: "Редкий коллекционный пистолет с уникальным дизайном.",
    price: 3000,
    category: "Пистолеты",
    damage: 60,
    fireRate: 30,
    accuracy: 60,
    range: 40,
  },
  {
    id: "beretta-m9",
    name: "Beretta M9",
    image: "/public/images/beretta-m9.png",
    description: "Стандартный армейский пистолет, точный и простой в обращении.",
    price: 1300,
    category: "Пистолеты",
    damage: 58,
    fireRate: 38,
    accuracy: 72,
    range: 48,
  },
  {
    id: "pocket-pistol",
    name: "Карманный Пистолет",
    image: "/public/images/pocket-pistol.png",
    description: "Компактный пистолет для скрытого ношения.",
    price: 800,
    category: "Пистолеты",
    damage: 45,
    fireRate: 35,
    accuracy: 55,
    range: 30,
  },
  {
    id: "sig-sauer-p250",
    name: "Sig Sauer P250",
    image: "/public/images/sig-sauer-p250.png",
    description: "Модульный пистолет с хорошей эргономикой.",
    price: 1400,
    category: "Пистолеты",
    damage: 57,
    fireRate: 39,
    accuracy: 71,
    range: 47,
  },
  {
    id: "orion-flare-gun",
    name: "Orion Flare Gun",
    image: "/public/images/orion-flare-gun.png",
    description: "Сигнальный пистолет, может использоваться для отвлечения или подачи сигнала.",
    price: 300,
    category: "Пистолеты",
    damage: 5,
    fireRate: 1,
    accuracy: 10,
    range: 100,
  },
  {
    id: "contender",
    name: "Contender",
    image: "/public/images/contender.png",
    description: "Однозарядный пистолет для точной стрельбы на дальние дистанции.",
    price: 1800,
    category: "Пистолеты",
    damage: 80,
    fireRate: 10,
    accuracy: 80,
    range: 70,
  },
  {
    id: "flintlock-rifle",
    name: "Кремневое Ружье",
    image: "/public/images/flintlock-rifle.png",
    description: "Старинное ружье, мощное, но медленное в перезарядке.",
    price: 1000,
    category: "Дробовики",
    damage: 90,
    fireRate: 5,
    accuracy: 40,
    range: 30,
  },
  {
    id: "sawed-off-shotgun",
    name: "Обрез",
    image: "/public/images/sawed-off-shotgun.png",
    description: "Компактный дробовик для ближнего боя.",
    price: 900,
    category: "Дробовики",
    damage: 95,
    fireRate: 30,
    accuracy: 30,
    range: 20,
  },
  {
    id: "mossberg-590-a1",
    name: "Mossberg 590A1",
    image: "/public/images/mossberg-590-a1.png",
    description: "Надежный помповый дробовик, идеален для самообороны.",
    price: 1800,
    category: "Дробовики",
    damage: 85,
    fireRate: 25,
    accuracy: 50,
    range: 35,
  },
  {
    id: "skorpion",
    name: "Skorpion",
    image: "/public/images/skorpion.png",
    description: "Компактный пистолет-пулемет с высокой скорострельностью.",
    price: 1600,
    category: "Пистолеты-пулеметы",
    damage: 40,
    fireRate: 80,
    accuracy: 50,
    range: 40,
  },
  {
    id: "sgw-suppressor",
    name: "SGW Suppressor",
    image: "/public/images/sgw-suppressor.png",
    description: "Пистолет-пулемет с интегрированным глушителем для скрытных операций.",
    price: 2200,
    category: "Пистолеты-пулеметы",
    damage: 45,
    fireRate: 75,
    accuracy: 60,
    range: 45,
  },
  {
    id: "fn-p90",
    name: "FN P90",
    image: "/public/images/fn-p90.png",
    description: "Футуристический пистолет-пулемет с большим магазином.",
    price: 2800,
    category: "Пистолеты-пулеметы",
    damage: 50,
    fireRate: 90,
    accuracy: 65,
    range: 50,
  },
  {
    id: "mp5",
    name: "MP5",
    image: "/public/images/mp5.png",
    description: "Классический пистолет-пулемет, надежный и точный.",
    price: 1700,
    category: "Пистолеты-пулеметы",
    damage: 48,
    fireRate: 85,
    accuracy: 68,
    range: 48,
  },
  {
    id: "tec-9",
    name: "TEC-9",
    image: "/public/images/tec-9.png",
    description: "Недорогой пистолет-пулемет с высокой скорострельностью.",
    price: 1000,
    category: "Пистолеты-пулеметы",
    damage: 35,
    fireRate: 95,
    accuracy: 45,
    range: 35,
  },
  {
    id: "mp5-mkii",
    name: "MP5 Mk II",
    image: "/public/images/mp5-mkii.png",
    description: "Улучшенная версия MP5 с повышенной точностью.",
    price: 2000,
    category: "Пистолеты-пулеметы",
    damage: 52,
    fireRate: 80,
    accuracy: 70,
    range: 50,
  },
  {
    id: "thompson",
    name: "Thompson",
    image: "/public/images/thompson.png",
    description: 'Легендарный "Томми-ган" времен сухого закона.',
    price: 2500,
    category: "Пистолеты-пулеметы",
    damage: 60,
    fireRate: 70,
    accuracy: 55,
    range: 45,
  },
  {
    id: "colt1911",
    name: "Colt 1911",
    image: "/public/images/colt1911.png",
    description: "Культовый пистолет, символ американского оружия.",
    price: 1600,
    category: "Пистолеты",
    damage: 65,
    fireRate: 30,
    accuracy: 68,
    range: 50,
  },
  {
    id: "serbu",
    name: "Serbu Super Shorty",
    image: "/public/images/serbu.png",
    description: "Ультракомпактный дробовик, идеален для ближнего боя.",
    price: 1100,
    category: "Дробовики",
    damage: 90,
    fireRate: 28,
    accuracy: 25,
    range: 15,
  },
  {
    id: "ak",
    name: "AK-47",
    image: "/public/images/ak.png",
    description: "Всемирно известный автомат, надежный и простой в использовании.",
    price: 3000,
    category: "Автоматы",
    damage: 65,
    fireRate: 60,
    accuracy: 55,
    range: 80,
  },
  {
    id: "bullpup-rifle",
    name: "Bullpup Rifle",
    image: "/public/images/bullpup-rifle.png",
    description: "Компактная штурмовая винтовка с хорошей точностью.",
    price: 3500,
    category: "Автоматы",
    damage: 68,
    fireRate: 65,
    accuracy: 70,
    range: 85,
  },
  {
    id: "hk-g36",
    name: "HK G36",
    image: "/public/images/hk-g36.png",
    description: "Современная штурмовая винтовка, легкая и точная.",
    price: 3200,
    category: "Автоматы",
    damage: 67,
    fireRate: 62,
    accuracy: 72,
    range: 82,
  },
  {
    id: "tar-21",
    name: "TAR-21",
    image: "/public/images/tar-21.png",
    description: "Израильская штурмовая винтовка, надежная и эргономичная.",
    price: 3400,
    category: "Автоматы",
    damage: 69,
    fireRate: 63,
    accuracy: 71,
    range: 83,
  },
  {
    id: "m4-a1",
    name: "M4A1",
    image: "/public/images/m4-a1.png",
    description: "Стандартная американская штурмовая винтовка, универсальная и эффективная.",
    price: 2800,
    category: "Автоматы",
    damage: 62,
    fireRate: 70,
    accuracy: 75,
    range: 78,
  },
  {
    id: "hk-g36-mkii",
    name: "HK G36 Mk II",
    image: "/public/images/hk-g36-mkii.png",
    description: "Улучшенная версия G36 с повышенной огневой мощью.",
    price: 3800,
    category: "Автоматы",
    damage: 70,
    fireRate: 68,
    accuracy: 73,
    range: 86,
  },
  {
    id: "aksu",
    name: "AKSU-74",
    image: "/public/images/aksu.png",
    description: "Компактная версия АК-74, идеальна для ближнего боя.",
    price: 2700,
    category: "Автоматы",
    damage: 60,
    fireRate: 70,
    accuracy: 60,
    range: 70,
  },
  {
    id: "ar-15-tx-15",
    name: "AR-15 TX-15",
    image: "/public/images/ar-15-tx-15.png",
    description: "Высокоточная винтовка на базе AR-15, для спортивной стрельбы.",
    price: 4000,
    category: "Винтовки",
    damage: 75,
    fireRate: 50,
    accuracy: 90,
    range: 100,
  },
  {
    id: "flick-knife",
    name: "Выкидной нож",
    image: "/public/images/flick-knife.png",
    description: "Компактный и быстрый нож для ближнего боя.",
    price: 150,
    category: "Холодное оружие",
    damage: 20,
    fireRate: 100,
    accuracy: 90,
    range: 1,
  },
  {
    id: "brass-knuckles",
    name: "Кастет",
    image: "/public/images/brass-knuckles.png",
    description: "Увеличивает урон в рукопашном бою.",
    price: 100,
    category: "Холодное оружие",
    damage: 25,
    fireRate: 120,
    accuracy: 95,
    range: 1,
  },
  {
    id: "army-knife-m9",
    name: "Армейский нож M9",
    image: "/public/images/army-knife-m9.png",
    description: "Стандартный армейский нож, универсален в использовании.",
    price: 200,
    category: "Холодное оружие",
    damage: 22,
    fireRate: 95,
    accuracy: 92,
    range: 1,
  },
  {
    id: "machete",
    name: "Мачете",
    image: "/public/images/machete.png",
    description: "Длинный и тяжелый нож, эффективен против нескольких противников.",
    price: 300,
    category: "Холодное оружие",
    damage: 30,
    fireRate: 80,
    accuracy: 85,
    range: 2,
  },
  {
    id: "cavalry-dagger",
    name: "Кавалерийский кинжал",
    image: "/public/images/cavalry-dagger.png",
    description: "Элегантный и острый кинжал, для точных ударов.",
    price: 400,
    category: "Холодное оружие",
    damage: 28,
    fireRate: 90,
    accuracy: 93,
    range: 1,
  },
  {
    id: "pinch-bar",
    name: "Монтировка",
    image: "/public/images/pinch-bar.png",
    description: "Тяжелый инструмент, может использоваться как оружие.",
    price: 50,
    category: "Холодное оружие",
    damage: 18,
    fireRate: 70,
    accuracy: 70,
    range: 2,
  },
  {
    id: "hammer",
    name: "Молоток",
    image: "/public/images/hammer.png",
    description: "Простой, но эффективный инструмент для ближнего боя.",
    price: 40,
    category: "Холодное оружие",
    damage: 15,
    fireRate: 80,
    accuracy: 75,
    range: 1,
  },
  {
    id: "crowbar",
    name: "Лом",
    image: "/public/images/crowbar.png",
    description: "Длинный и прочный лом, для нанесения сильных ударов.",
    price: 60,
    category: "Холодное оружие",
    damage: 20,
    fireRate: 65,
    accuracy: 68,
    range: 2,
  },
  {
    id: "billiard-cue",
    name: "Бильярдный кий",
    image: "/public/images/billiard-cue.png",
    description: "Легкий и длинный кий, для быстрых ударов.",
    price: 30,
    category: "Холодное оружие",
    damage: 12,
    fireRate: 85,
    accuracy: 80,
    range: 2,
  },
  {
    id: "golf-hockey-stick",
    name: "Клюшка для гольфа/хоккея",
    image: "/public/images/golf-hockey-stick.png",
    description: "Спортивный инвентарь, может быть использован как импровизированное оружие.",
    price: 70,
    category: "Холодное оружие",
    damage: 17,
    fireRate: 70,
    accuracy: 72,
    range: 2,
  },
  {
    id: "fire-extinguisher-refill",
    name: "Огнетушитель",
    image: "/public/images/fire-extinguisher-refill.png",
    description: "Может использоваться для тушения пожаров или как тяжелое оружие.",
    price: 120,
    category: "Прочее",
    damage: 10,
    fireRate: 5,
    accuracy: 30,
    range: 3,
  },
  {
    id: "axe",
    name: "Топор",
    image: "/public/images/axe.png",
    description: "Классический топор, для рубки дров или врагов.",
    price: 250,
    category: "Холодное оружие",
    damage: 35,
    fireRate: 60,
    accuracy: 70,
    range: 2,
  },
  {
    id: "battle-axe",
    name: "Боевой топор",
    image: "/public/images/battle-axe.png",
    description: "Тяжелый боевой топор, для максимального урона.",
    price: 500,
    category: "Холодное оружие",
    damage: 45,
    fireRate: 50,
    accuracy: 65,
    range: 2,
  },
  {
    id: "flashlight",
    name: "Фонарик",
    image: "/public/images/flashlight.png",
    description: "Освещает путь в темноте, может использоваться для оглушения.",
    price: 20,
    category: "Прочее",
    damage: 5,
    fireRate: 10,
    accuracy: 40,
    range: 1,
  },
  {
    id: "adjustable-spanner",
    name: "Разводной ключ",
    image: "/public/images/adjustable-spanner.png",
    description: "Инструмент, который может пригодиться в драке.",
    price: 35,
    category: "Холодное оружие",
    damage: 14,
    fireRate: 75,
    accuracy: 70,
    range: 1,
  },
  {
    id: "jerrycan",
    name: "Канистра с бензином",
    image: "/public/images/jerrycan.png",
    description: "Для заправки транспорта или создания огненных ловушек.",
    price: 80,
    category: "Прочее",
    damage: 0,
    fireRate: 0,
    accuracy: 0,
    range: 5,
  },
]

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const { addToCart } = useCart()

  const categories = ["Все", ...new Set(weapons.map((weapon) => weapon.category))]

  const filteredWeapons =
    selectedCategory === "Все" ? weapons : weapons.filter((weapon) => weapon.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Каталог оружия</h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-red-600 text-red-600 hover:bg-red-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredWeapons.map((weapon) => (
            <WeaponTooltip key={weapon.id} weapon={weapon}>
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-red-600">{weapon.name}</CardTitle>
                  <p className="text-sm text-gray-500">{weapon.category}</p>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-4">
                  <Image
                    src={weapon.image || "/placeholder.svg"}
                    alt={weapon.name}
                    width={150}
                    height={150}
                    className="object-contain max-h-[150px]"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-center pt-2">
                  <p className="text-2xl font-bold text-gray-800 mb-2">${weapon.price.toLocaleString()}</p>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent tooltip from closing immediately
                      addToCart(weapon)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Добавить в корзину
                  </Button>
                </CardFooter>
              </Card>
            </WeaponTooltip>
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
