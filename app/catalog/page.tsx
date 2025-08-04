"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../contexts/CartContext"
import { WeaponTooltip } from "../components/WeaponTooltip"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  ammoPrice?: number // Цена за пачку патронов, если применимо
}

const products: Product[] = [
  // Melee Weapons
  {
    id: "melee-flick-knife",
    name: "Выкидной нож",
    category: "Холодное оружие",
    price: 150,
    image: "/public/images/flick-knife.png",
    description: "Компактный и смертоносный, идеален для скрытых атак.",
  },
  {
    id: "melee-brass-knuckles",
    name: "Кастет",
    category: "Холодное оружие",
    price: 100,
    image: "/public/images/brass-knuckles.png",
    description: "Увеличьте силу удара в ближнем бою.",
  },
  {
    id: "melee-army-knife-m9",
    name: "Армейский нож M9",
    category: "Холодное оружие",
    price: 200,
    image: "/public/images/army-knife-m9.png",
    description: "Надежный нож для выживания и ближнего боя.",
  },
  {
    id: "melee-machete",
    name: "Мачете",
    category: "Холодное оружие",
    price: 250,
    image: "/public/images/machete.png",
    description: "Длинный и острый, отлично подходит для расчистки пути и ближнего боя.",
  },
  {
    id: "melee-cavalry-dagger",
    name: "Кавалерийский кинжал",
    category: "Холодное оружие",
    price: 300,
    image: "/public/images/cavalry-dagger.png",
    description: "Элегантный и смертоносный, для ценителей классики.",
  },
  {
    id: "melee-pinch-bar",
    name: "Монтировка",
    category: "Холодное оружие",
    price: 80,
    image: "/public/images/pinch-bar.png",
    description: "Простой, но эффективный инструмент для ближнего боя и взлома.",
  },
  {
    id: "melee-hammer",
    name: "Молоток",
    category: "Холодное оружие",
    price: 70,
    image: "/public/images/hammer.png",
    description: "Тяжелый и мощный, для нанесения сокрушительных ударов.",
  },
  {
    id: "melee-crowbar",
    name: "Лом",
    category: "Холодное оружие",
    price: 90,
    image: "/public/images/crowbar.png",
    description: "Универсальный инструмент для ближнего боя и разрушения.",
  },
  {
    id: "melee-billiard-cue",
    name: "Бильярдный кий",
    category: "Холодное оружие",
    price: 60,
    image: "/public/images/billiard-cue.png",
    description: "Неожиданное, но эффективное оружие в умелых руках.",
  },
  {
    id: "melee-golf-hockey-stick",
    name: "Клюшка для гольфа/хоккея",
    category: "Холодное оружие",
    price: 50,
    image: "/public/images/golf-hockey-stick.png",
    description: "Спортивный инвентарь, который может стать грозным оружием.",
  },
  {
    id: "melee-fire-extinguisher-refill",
    name: "Огнетушитель (перезаряжаемый)",
    category: "Холодное оружие",
    price: 120,
    image: "/public/images/fire-extinguisher-refill.png",
    description: "Может использоваться как дубинка или для создания дымовой завесы.",
  },
  {
    id: "melee-axe",
    name: "Топор",
    category: "Холодное оружие",
    price: 180,
    image: "/public/images/axe.png",
    description: "Классическое оружие для ближнего боя, способное нанести серьезный урон.",
  },
  {
    id: "melee-battle-axe",
    name: "Боевой топор",
    category: "Холодное оружие",
    price: 350,
    image: "/public/images/battle-axe.png",
    description: "Двусторонний боевой топор для максимального урона.",
  },
  {
    id: "melee-flashlight",
    name: "Фонарик",
    category: "Холодное оружие",
    price: 40,
    image: "/public/images/flashlight.png",
    description: "Полезен в темноте и может быть использован для оглушения противника.",
  },
  {
    id: "melee-adjustable-spanner",
    name: "Разводной ключ",
    category: "Холодное оружие",
    price: 60,
    image: "/public/images/adjustable-spanner.png",
    description: "Тяжелый металлический инструмент, эффективный в ближнем бою.",
  },
  {
    id: "melee-jerrycan",
    name: "Канистра с бензином",
    category: "Холодное оружие",
    price: 30,
    image: "/public/images/jerrycan.png",
    description: "Может быть использована для поджога или как импровизированное оружие.",
  },

  // Pistols
  {
    id: "pistol-revolver",
    name: "Револьвер",
    category: "Пистолеты",
    price: 1000,
    image: "/public/images/revolver.png",
    description: "Классический револьвер, мощный и надежный.",
    ammoPrice: 50,
  },
  {
    id: "pistol-desert-eagle",
    name: "Desert Eagle",
    category: "Пистолеты",
    price: 1500,
    image: "/public/images/desert-eagle.png",
    description: "Легендарный пистолет с огромной останавливающей силой.",
    ammoPrice: 70,
  },
  {
    id: "pistol-revolver-mk-ii",
    name: "Револьвер Mk II",
    category: "Пистолеты",
    price: 1200,
    image: "/public/images/revolver-mk-ii.png",
    description: "Улучшенная версия револьвера с повышенной точностью.",
    ammoPrice: 60,
  },
  {
    id: "pistol-gold-revolver",
    name: "Золотой револьвер",
    category: "Пистолеты",
    price: 2500,
    image: "/public/images/gold-revolver.png",
    description: "Роскошный револьвер для тех, кто ценит стиль и мощь.",
    ammoPrice: 80,
  },
  {
    id: "pistol-glock-17",
    name: "Glock 17",
    category: "Пистолеты",
    price: 800,
    image: "/public/images/glock-17.png",
    description: "Надежный и популярный полуавтоматический пистолет.",
    ammoPrice: 40,
  },
  {
    id: "pistol-vintage-pistol",
    name: "Винтажный пистолет",
    category: "Пистолеты",
    price: 700,
    image: "/public/images/vintage-pistol.png",
    description: "Старинный пистолет с уникальным дизайном.",
    ammoPrice: 35,
  },
  {
    id: "pistol-beretta-m9",
    name: "Beretta M9",
    category: "Пистолеты",
    price: 900,
    image: "/public/images/beretta-m9.png",
    description: "Стандартный армейский пистолет, точный и простой в обращении.",
    ammoPrice: 45,
  },
  {
    id: "pistol-pocket-pistol",
    name: "Карманный пистолет",
    category: "Пистолеты",
    price: 400,
    image: "/public/images/pocket-pistol.png",
    description: "Маленький и незаметный, идеален для скрытого ношения.",
    ammoPrice: 25,
  },
  {
    id: "pistol-sig-sauer-p250",
    name: "Sig Sauer P250",
    category: "Пистолеты",
    price: 850,
    image: "/public/images/sig-sauer-p250.png",
    description: "Модульный пистолет с хорошей эргономикой.",
    ammoPrice: 42,
  },
  {
    id: "pistol-orion-flare-gun",
    name: "Сигнальный пистолет Orion",
    category: "Пистолеты",
    price: 300,
    image: "/public/images/orion-flare-gun.png",
    description: "Для подачи сигналов или временного ослепления противника.",
    ammoPrice: 10,
  },
  {
    id: "pistol-contender",
    name: "Contender",
    category: "Пистолеты",
    price: 1100,
    image: "/public/images/contender.png",
    description: "Однозарядный пистолет с высокой точностью.",
    ammoPrice: 55,
  },
  {
    id: "pistol-flintlock-rifle",
    name: "Кремневое ружье",
    category: "Пистолеты",
    price: 600,
    image: "/public/images/flintlock-rifle.png",
    description: "Старинное однозарядное ружье, мощное на близкой дистанции.",
    ammoPrice: 30,
  },

  // Shotguns
  {
    id: "shotgun-sawed-off",
    name: "Обрез",
    category: "Дробовики",
    price: 1200,
    image: "/public/images/sawed-off-shotgun.png",
    description: "Компактный дробовик с разрушительной мощью на близкой дистанции.",
    ammoPrice: 60,
  },
  {
    id: "shotgun-mossberg-590-a1",
    name: "Mossberg 590A1",
    category: "Дробовики",
    price: 1800,
    image: "/public/images/mossberg-590-a1.png",
    description: "Надежный помповый дробовик для любых ситуаций.",
    ammoPrice: 80,
  },
  {
    id: "shotgun-serbu",
    name: "Serbu Super Shorty",
    category: "Дробовики",
    price: 1500,
    image: "/public/images/serbu.png",
    description: "Ультракомпактный дробовик, идеален для ближнего боя.",
    ammoPrice: 75,
  },

  // SMGs
  {
    id: "smg-skorpion",
    name: "Skorpion",
    category: "Пистолеты-пулеметы",
    price: 1500,
    image: "/public/images/skorpion.png",
    description: "Компактный и скорострельный пистолет-пулемет.",
    ammoPrice: 70,
  },
  {
    id: "smg-sgw-suppressor",
    name: "SGW с глушителем",
    category: "Пистолеты-пулеметы",
    price: 1800,
    image: "/public/images/sgw-suppressor.png",
    description: "Бесшумный пистолет-пулемет для скрытных операций.",
    ammoPrice: 85,
  },
  {
    id: "smg-fn-p90",
    name: "FN P90",
    category: "Пистолеты-пулеметы",
    price: 2200,
    image: "/public/images/fn-p90.png",
    description: "Футуристический пистолет-пулемет с высокой емкостью магазина.",
    ammoPrice: 90,
  },
  {
    id: "smg-mp5",
    name: "MP5",
    category: "Пистолеты-пулеметы",
    price: 1700,
    image: "/public/images/mp5.png",
    description: "Классический пистолет-пулемет, надежный и точный.",
    ammoPrice: 80,
  },
  {
    id: "smg-tec-9",
    name: "TEC-9",
    category: "Пистолеты-пулеметы",
    price: 1300,
    image: "/public/images/tec-9.png",
    description: "Простой и эффективный пистолет-пулемет.",
    ammoPrice: 65,
  },
  {
    id: "smg-mp5-mkii",
    name: "MP5 Mk II",
    category: "Пистолеты-пулеметы",
    price: 1900,
    image: "/public/images/mp5-mkii.png",
    description: "Улучшенная версия MP5 с дополнительными модификациями.",
    ammoPrice: 88,
  },
  {
    id: "smg-thompson",
    name: "Thompson",
    category: "Пистолеты-пулеметы",
    price: 2000,
    image: "/public/images/thompson.png",
    description: "Легендарный пистолет-пулемет времен сухого закона.",
    ammoPrice: 95,
  },

  // Assault Rifles
  {
    id: "ar-ak",
    name: "AK-47",
    category: "Штурмовые винтовки",
    price: 2500,
    image: "/public/images/ak.png",
    description: "Надежная и мощная штурмовая винтовка, известная своей простотой.",
    ammoPrice: 100,
  },
  {
    id: "ar-bullpup-rifle",
    name: "Винтовка Булл-пап",
    category: "Штурмовые винтовки",
    price: 2800,
    image: "/public/images/bullpup-rifle.png",
    description: "Компактная штурмовая винтовка с длинным стволом.",
    ammoPrice: 110,
  },
  {
    id: "ar-hk-g36",
    name: "HK G36",
    category: "Штурмовые винтовки",
    price: 3000,
    image: "/public/images/hk-g36.png",
    description: "Современная штурмовая винтовка с высокой точностью.",
    ammoPrice: 120,
  },
  {
    id: "ar-tar-21",
    name: "TAR-21",
    category: "Штурмовые винтовки",
    price: 2900,
    image: "/public/images/tar-21.png",
    description: "Израильская штурмовая винтовка, надежная и эргономичная.",
    ammoPrice: 115,
  },
  {
    id: "ar-m4-a1",
    name: "M4A1",
    category: "Штурмовые винтовки",
    price: 2700,
    image: "/public/images/m4-a1.png",
    description: "Стандартная американская штурмовая винтовка, универсальная и эффективная.",
    ammoPrice: 105,
  },
  {
    id: "ar-hk-g36-mkii",
    name: "HK G36 Mk II",
    category: "Штурмовые винтовки",
    price: 3200,
    image: "/public/images/hk-g36-mkii.png",
    description: "Улучшенная версия G36 с дополнительными возможностями.",
    ammoPrice: 125,
  },
  {
    id: "ar-aksu",
    name: "AKS-74U",
    category: "Штурмовые винтовки",
    price: 2600,
    image: "/public/images/aksu.png",
    description: "Компактная версия АК-74, идеальна для ближнего и среднего боя.",
    ammoPrice: 102,
  },
  {
    id: "ar-ar-15-tx-15",
    name: "AR-15 TX-15",
    category: "Штурмовые винтовки",
    price: 3100,
    image: "/public/images/ar-15-tx-15.png",
    description: "Модифицированная AR-15 с улучшенной эргономикой и точностью.",
    ammoPrice: 118,
  },
  {
    id: "ar-colt1911",
    name: "Colt 1911",
    category: "Пистолеты",
    price: 950,
    image: "/public/images/colt1911.png",
    description: "Легендарный пистолет, символ американского оружия.",
    ammoPrice: 48,
  },
]

export default function Catalog() {
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [ammoQuantities, setAmmoQuantities] = useState<{ [key: string]: number }>({})

  const handleQuantityChange = (productId: string, value: string) => {
    const num = Number.parseInt(value)
    setQuantities((prev) => ({ ...prev, [productId]: isNaN(num) ? 0 : num }))
  }

  const handleAmmoQuantityChange = (productId: string, value: string) => {
    const num = Number.parseInt(value)
    setAmmoQuantities((prev) => ({ ...prev, [productId]: isNaN(num) ? 0 : num }))
  }

  const filteredProducts =
    selectedCategory === "Все" ? products : products.filter((product) => product.category === selectedCategory)

  const categories = ["Все", ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Наш каталог</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Label htmlFor="category-filter" className="text-lg font-semibold text-gray-700">
            Категория:
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter" className="w-[200px] bg-white">
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <WeaponTooltip
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              ammoPrice={product.ammoPrice}
            >
              <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center p-4 pb-2">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain mb-2"
                  />
                  <CardTitle className="text-xl font-bold text-red-700">{product.name}</CardTitle>
                  <p className="text-gray-800 font-semibold text-lg">${product.price.toLocaleString()}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between p-4 pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuantityChange(product.id, String((quantities[product.id] || 0) - 1))
                      }}
                      disabled={(quantities[product.id] || 0) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantities[product.id] || 0}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 text-center"
                      min="0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuantityChange(product.id, String((quantities[product.id] || 0) + 1))
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.ammoPrice !== undefined && (
                    <div className="flex flex-col items-center mt-2">
                      <Label htmlFor={`ammo-quantity-${product.id}`} className="text-sm text-gray-700 mb-1">
                        Патроны (пачек):
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAmmoQuantityChange(product.id, String((ammoQuantities[product.id] || 0) - 1))
                          }}
                          disabled={(ammoQuantities[product.id] || 0) <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`ammo-quantity-${product.id}`}
                          type="number"
                          value={ammoQuantities[product.id] || 0}
                          onChange={(e) => handleAmmoQuantityChange(product.id, e.target.value)}
                          className="w-20 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAmmoQuantityChange(product.id, String((ammoQuantities[product.id] || 0) + 1))
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">${product.ammoPrice.toLocaleString()} за пачку</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    onClick={() => addItem(product, quantities[product.id] || 0, ammoQuantities[product.id] || 0)}
                    disabled={(quantities[product.id] || 0) <= 0 && (ammoQuantities[product.id] || 0) <= 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
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
