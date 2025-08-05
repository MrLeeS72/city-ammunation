"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"
import { toast } from "@/hooks/use-toast"
import Header from "../components/Header"
import WeaponTooltip from "../components/WeaponTooltip"

interface Weapon {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  ammoPrice?: number // Price per pack of ammo
}

const weapons: Weapon[] = [
  // Melee
  {
    id: "melee-1",
    name: "Флик-нож",
    category: "Ближний бой",
    price: 100,
    image: "/images/flick-knife.png",
    description: "Компактный складной нож для скрытого ношения и быстрой самообороны.",
  },
  {
    id: "melee-2",
    name: "Кастет",
    category: "Ближний бой",
    price: 150,
    image: "/images/brass-knuckles.png",
    description: "Металлический кастет для усиления удара в рукопашном бою.",
  },
  {
    id: "melee-3",
    name: "Армейский нож M9",
    category: "Ближний бой",
    price: 200,
    image: "/images/army-knife-m9.png",
    description: "Многофункциональный армейский нож, надежный в любой ситуации.",
  },
  {
    id: "melee-4",
    name: "Мачете",
    category: "Ближний бой",
    price: 250,
    image: "/images/machete.png",
    description: "Длинный и тяжелый нож, идеально подходящий для расчистки зарослей или ближнего боя.",
  },
  {
    id: "melee-5",
    name: "Кавалерийский кинжал",
    category: "Ближний бой",
    price: 300,
    image: "/images/cavalry-dagger.png",
    description: "Элегантный и острый кинжал, используемый кавалеристами.",
  },
  {
    id: "melee-6",
    name: "Монтировка",
    category: "Ближний бой",
    price: 80,
    image: "/images/pinch-bar.png",
    description: "Прочная монтировка, полезная как инструмент, так и в ближнем бою.",
  },
  {
    id: "melee-7",
    name: "Молоток",
    category: "Ближний бой",
    price: 70,
    image: "/images/hammer.png",
    description: "Обычный молоток, который может быть использован в качестве импровизированного оружия.",
  },
  {
    id: "melee-8",
    name: "Лом",
    category: "Ближний бой",
    price: 90,
    image: "/images/crowbar.png",
    description: "Тяжелый металлический лом, эффективный для взлома и в ближнем бою.",
  },
  {
    id: "melee-9",
    name: "Бильярдный кий",
    category: "Ближний бой",
    price: 60,
    image: "/images/billiard-cue.png",
    description: "Длинный и легкий бильярдный кий, может быть использован как дубинка.",
  },
  {
    id: "melee-10",
    name: "Клюшка для гольфа/хоккея",
    category: "Ближний бой",
    price: 75,
    image: "/images/golf-hockey-stick.png",
    description: "Спортивная клюшка, пригодная для самообороны.",
  },
  {
    id: "melee-11",
    name: "Огнетушитель",
    category: "Ближний бой",
    price: 120,
    image: "/images/fire-extinguisher-refill.png",
    description: "Портативный огнетушитель, может быть использован для тушения пожаров или как тяжелый предмет.",
  },
  {
    id: "melee-12",
    name: "Топор",
    category: "Ближний бой",
    price: 180,
    image: "/images/axe.png",
    description: "Острый топор, эффективный для рубки дерева и в ближнем бою.",
  },
  {
    id: "melee-13",
    name: "Боевой топор",
    category: "Ближний бой",
    price: 350,
    image: "/images/battle-axe.png",
    description: "Тяжелый боевой топор, предназначенный для максимального урона.",
  },
  {
    id: "melee-14",
    name: "Фонарик",
    category: "Ближний бой",
    price: 50,
    image: "/images/flashlight.png",
    description: "Обычный фонарик, может быть использован для освещения или как легкое оружие.",
  },
  {
    id: "melee-15",
    name: "Разводной ключ",
    category: "Ближний бой",
    price: 65,
    image: "/images/adjustable-spanner.png",
    description: "Тяжелый разводной ключ, может быть использован как ударное оружие.",
  },
  {
    id: "melee-16",
    name: "Канистра с бензином",
    category: "Ближний бой",
    price: 40,
    image: "/images/jerrycan.png",
    description: "Канистра с легковоспламеняющимся бензином, может быть использована для поджога.",
  },

  // Pistols
  {
    id: "pistol-1",
    name: "Револьвер",
    category: "Пистолеты",
    price: 500,
    image: "/images/revolver.png",
    description: "Классический револьвер, надежный и мощный.",
    ammoPrice: 10,
  },
  {
    id: "pistol-2",
    name: "Desert Eagle",
    category: "Пистолеты",
    price: 800,
    image: "/images/desert-eagle.png",
    description: "Мощный пистолет с высоким останавливающим действием.",
    ammoPrice: 15,
  },
  {
    id: "pistol-3",
    name: "Револьвер Mk II",
    category: "Пистолеты",
    price: 750,
    image: "/images/revolver-mk-ii.png",
    description: "Улучшенная версия классического револьвера с повышенной точностью.",
    ammoPrice: 12,
  },
  {
    id: "pistol-4",
    name: "Золотой револьвер",
    category: "Пистолеты",
    price: 1500,
    image: "/images/gold-revolver.png",
    description: "Эксклюзивный револьвер с золотым покрытием, символ статуса и мощи.",
    ammoPrice: 20,
  },
  {
    id: "pistol-5",
    name: "Glock 17",
    category: "Пистолеты",
    price: 450,
    image: "/images/glock-17.png",
    description: "Надежный и популярный пистолет, широко используемый правоохранительными органами.",
    ammoPrice: 8,
  },
  {
    id: "pistol-6",
    name: "Винтажный пистолет",
    category: "Пистолеты",
    price: 600,
    image: "/images/vintage-pistol.png",
    description: "Старинный пистолет с уникальным дизайном, коллекционная ценность.",
    ammoPrice: 10,
  },
  {
    id: "pistol-7",
    name: "Beretta M9",
    category: "Пистолеты",
    price: 550,
    image: "/images/beretta-m9.png",
    description: "Стандартный армейский пистолет, известный своей надежностью.",
    ammoPrice: 9,
  },
  {
    id: "pistol-8",
    name: "Карманный пистолет",
    category: "Пистолеты",
    price: 300,
    image: "/images/pocket-pistol.png",
    description: "Маленький и легкий пистолет для скрытого ношения.",
    ammoPrice: 7,
  },
  {
    id: "pistol-9",
    name: "SIG Sauer P250",
    category: "Пистолеты",
    price: 520,
    image: "/images/sig-sauer-p250.png",
    description: "Модульный пистолет, позволяющий менять калибр и размер.",
    ammoPrice: 9,
  },
  {
    id: "pistol-10",
    name: "Orion Flare Gun",
    category: "Пистолеты",
    price: 200,
    image: "/images/orion-flare-gun.png",
    description: "Сигнальный пистолет, стреляющий осветительными ракетами.",
    ammoPrice: 5,
  },
  {
    id: "pistol-11",
    name: "Contender",
    category: "Пистолеты",
    price: 700,
    image: "/images/contender.png",
    description: "Однозарядный пистолет, известный своей точностью и мощностью.",
    ammoPrice: 12,
  },
  {
    id: "pistol-12",
    name: "Colt 1911",
    category: "Пистолеты",
    price: 650,
    image: "/images/colt1911.png",
    description: "Легендарный пистолет, символ американского оружия.",
    ammoPrice: 10,
  },

  // Shotguns
  {
    id: "shotgun-1",
    name: "Кремневое ружье",
    category: "Дробовики",
    price: 800,
    image: "/images/flintlock-rifle.png",
    description: "Старинное кремневое ружье, мощное на близких дистанциях.",
    ammoPrice: 20,
  },
  {
    id: "shotgun-2",
    name: "Обрез",
    category: "Дробовики",
    price: 600,
    image: "/images/sawed-off-shotgun.png",
    description: "Компактный обрез, идеальный для ближнего боя.",
    ammoPrice: 18,
  },
  {
    id: "shotgun-3",
    name: "Mossberg 590A1",
    category: "Дробовики",
    price: 1200,
    image: "/images/mossberg-590-a1.png",
    description: "Надежный помповый дробовик, используемый военными и полицией.",
    ammoPrice: 25,
  },
  {
    id: "shotgun-4",
    name: "Serbu Super Shorty",
    category: "Дробовики",
    price: 900,
    image: "/images/serbu.png",
    description: "Ультракомпактный дробовик, легко скрываемый.",
    ammoPrice: 22,
  },

  // SMGs
  {
    id: "smg-1",
    name: "Skorpion",
    category: "Пистолеты-пулеметы",
    price: 700,
    image: "/images/skorpion.png",
    description: "Компактный пистолет-пулемет с высокой скорострельностью.",
    ammoPrice: 15,
  },
  {
    id: "smg-2",
    name: "SGW Suppressor",
    category: "Пистолеты-пулеметы",
    price: 900,
    image: "/images/sgw-suppressor.png",
    description: "Пистолет-пулемет с интегрированным глушителем для скрытных операций.",
    ammoPrice: 18,
  },
  {
    id: "smg-3",
    name: "FN P90",
    category: "Пистолеты-пулеметы",
    price: 1100,
    image: "/images/fn-p90.png",
    description: "Футуристический пистолет-пулемет с уникальным дизайном и высокой емкостью магазина.",
    ammoPrice: 20,
  },
  {
    id: "smg-4",
    name: "MP5",
    category: "Пистолеты-пулеметы",
    price: 1000,
    image: "/images/mp5.png",
    description: "Классический пистолет-пулемет, широко используемый спецподразделениями.",
    ammoPrice: 17,
  },
  {
    id: "smg-5",
    name: "TEC-9",
    category: "Пистолеты-пулеметы",
    price: 650,
    image: "/images/tec-9.png",
    description: "Простой и надежный пистолет-пулемет, популярный в криминальных кругах.",
    ammoPrice: 14,
  },
  {
    id: "smg-6",
    name: "MP5 Mk II",
    category: "Пистолеты-пулеметы",
    price: 1200,
    image: "/images/mp5-mkii.png",
    description: "Модернизированная версия MP5 с улучшенными характеристиками.",
    ammoPrice: 19,
  },
  {
    id: "smg-7",
    name: "Thompson",
    category: "Пистолеты-пулеметы",
    price: 950,
    image: "/images/thompson.png",
    description: "Легендарный пистолет-пулемет времен Сухого закона.",
    ammoPrice: 16,
  },

  // Assault Rifles
  {
    id: "ar-1",
    name: "AK-47",
    category: "Штурмовые винтовки",
    price: 1500,
    image: "/images/ak.png",
    description: "Надежная и мощная штурмовая винтовка, известная своей простотой.",
    ammoPrice: 30,
  },
  {
    id: "ar-2",
    name: "Bullpup Rifle",
    category: "Штурмовые винтовки",
    price: 1800,
    image: "/images/bullpup-rifle.png",
    description: "Компактная штурмовая винтовка с компоновкой буллпап.",
    ammoPrice: 35,
  },
  {
    id: "ar-3",
    name: "HK G36",
    category: "Штурмовые винтовки",
    price: 2000,
    image: "/images/hk-g36.png",
    description: "Современная штурмовая винтовка, используемая многими армиями мира.",
    ammoPrice: 40,
  },
  {
    id: "ar-4",
    name: "TAR-21",
    category: "Штурмовые винтовки",
    price: 2200,
    image: "/images/tar-21.png",
    description: "Израильская штурмовая винтовка с компоновкой буллпап, надежная и точная.",
    ammoPrice: 42,
  },
  {
    id: "ar-5",
    name: "M4A1",
    category: "Штурмовые винтовки",
    price: 1700,
    image: "/images/m4-a1.png",
    description: "Стандартная американская штурмовая винтовка, легкая и универсальная.",
    ammoPrice: 32,
  },
  {
    id: "ar-6",
    name: "HK G36 Mk II",
    category: "Штурмовые винтовки",
    price: 2300,
    image: "/images/hk-g36-mkii.png",
    description: "Улучшенная версия G36 с дополнительными тактическими возможностями.",
    ammoPrice: 45,
  },
  {
    id: "ar-7",
    name: "AKSU",
    category: "Штурмовые винтовки",
    price: 1400,
    image: "/images/aksu.png",
    description: "Компактная версия АК-47, идеальная для ближнего боя и ограниченных пространств.",
    ammoPrice: 28,
  },
  {
    id: "ar-8",
    name: "AR-15 TX-15",
    category: "Штурмовые винтовки",
    price: 1600,
    image: "/images/ar-15-tx-15.png",
    description: "Гражданская версия AR-15, популярная среди стрелков-спортсменов.",
    ammoPrice: 30,
  },
]

export default function CatalogPage() {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000])
  const [showAmmoOption, setShowAmmoOption] = useState(false)

  const categories = ["Все", ...new Set(weapons.map((weapon) => weapon.category))]

  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch = weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Все" || weapon.category === selectedCategory
    const matchesPrice = weapon.price >= priceRange[0] && weapon.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleAddToCart = (weapon: Weapon, quantity: number, ammoQuantity: number) => {
    if (quantity <= 0) {
      toast({
        title: "Ошибка",
        description: "Количество должно быть больше 0.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: weapon.id,
      name: weapon.name,
      price: weapon.price,
      quantity,
      ammoQuantity,
      ammoPrice: weapon.ammoPrice,
    })
    toast({
      title: "Добавлено в корзину",
      description: `${quantity}x ${weapon.name} ${ammoQuantity > 0 ? `и ${ammoQuantity} пачек патронов` : ""}`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Каталог оружия</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <Card className="lg:col-span-1 p-4 sticky top-24 h-fit">
            <CardHeader className="mb-4">
              <CardTitle className="text-2xl">Фильтры</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="search">Поиск по названию</Label>
                <Input
                  id="search"
                  placeholder="Найти оружие..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Категория</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price-range">Цена</Label>
                <Slider
                  id="price-range"
                  min={0}
                  max={3000}
                  step={50}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  range
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weapon List */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWeapons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Ничего не найдено по вашему запросу.</p>
              </div>
            ) : (
              filteredWeapons.map((weapon) => (
                <Card key={weapon.id} className="flex flex-col">
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl">{weapon.name}</CardTitle>
                    <CardDescription>{weapon.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <WeaponTooltip weapon={weapon}>
                      <Image
                        src={weapon.image || "/placeholder.png"}
                        alt={weapon.name}
                        width={200}
                        height={150}
                        className="object-contain h-36 w-auto mb-4"
                      />
                    </WeaponTooltip>
                    <p className="text-2xl font-bold text-red-600">${weapon.price}</p>
                    {weapon.ammoPrice && <p className="text-sm text-gray-500">Патроны: ${weapon.ammoPrice} за пачку</p>}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2 p-4 pt-0">
                    <div className="flex items-center space-x-2 w-full">
                      <Label htmlFor={`quantity-${weapon.id}`} className="sr-only">
                        Количество
                      </Label>
                      <Input
                        id={`quantity-${weapon.id}`}
                        type="number"
                        defaultValue={1}
                        min={1}
                        className="w-20"
                        onChange={(e) => {
                          const quantity = Number.parseInt(e.target.value)
                          e.target.dataset.quantity = isNaN(quantity) ? "0" : quantity.toString()
                        }}
                      />
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          const quantityInput = e.currentTarget.previousElementSibling as HTMLInputElement
                          const quantity = Number.parseInt(quantityInput.dataset.quantity || "1")
                          const ammoQuantityInput = e.currentTarget.parentElement?.nextElementSibling?.querySelector(
                            `#ammo-quantity-${weapon.id}`,
                          ) as HTMLInputElement
                          const ammoQuantity = ammoQuantityInput ? Number.parseInt(ammoQuantityInput.value || "0") : 0
                          handleAddToCart(weapon, quantity, ammoQuantity)
                        }}
                      >
                        Добавить в корзину
                      </Button>
                    </div>
                    {weapon.ammoPrice && (
                      <div className="flex items-center space-x-2 w-full">
                        <Label htmlFor={`ammo-quantity-${weapon.id}`} className="sr-only">
                          Количество патронов
                        </Label>
                        <Input
                          id={`ammo-quantity-${weapon.id}`}
                          type="number"
                          defaultValue={0}
                          min={0}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600 flex-1">Пачек патронов</span>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
