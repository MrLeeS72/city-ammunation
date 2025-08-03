"use client"

import Header from "../components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import WeaponTooltip from "../components/WeaponTooltip"

// Define weapon specifications
const weaponSpecs = {
  // Категория "9мм"
  "Карманный пистолет": {
    caliber: "9×19мм Parabellum",
    capacity: "6 патронов",
    weight: "0.45 кг",
    length: "140 мм",
    effectiveRange: "25 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Mauser",
    additionalInfo: "Компактный, легко скрываемый пистолет",
  },
  "BERETTA M9": {
    caliber: "9×19мм Parabellum",
    capacity: "15 патронов",
    weight: "0.97 кг",
    length: "217 мм",
    effectiveRange: "50 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Beretta",
    additionalInfo: "Стандартный пистолет вооруженных сил США с 1985 по 2017 год",
  },
  "SIG Sauer P250": {
    caliber: "9×19мм Parabellum",
    capacity: "15 патронов",
    weight: "0.83 кг",
    length: "203 мм",
    effectiveRange: "50 м",
    firingModes: "Полуавтоматический",
    manufacturer: "SIG Sauer",
    additionalInfo: "Модульная конструкция с возможностью смены калибра",
  },
  "Glock - 17": {
    caliber: "9×19мм Parabellum",
    capacity: "17 патронов",
    weight: "0.71 кг",
    length: "204 мм",
    effectiveRange: "50 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Glock",
    additionalInfo: "Один из самых популярных служебных пистолетов в мире",
  },
  "Винтажный пистолет": {
    caliber: "9×19мм Parabellum",
    capacity: "10 патронов",
    weight: "0.9 кг",
    length: "215 мм",
    effectiveRange: "40 м",
    firingModes: "Полуавтоматический",
    manufacturer: "FN Herstal",
    additionalInfo: "Коллекционная модель с деревянной рукоятью",
  },
  "Сигнальный пистолет": {
    caliber: "26.5 мм",
    capacity: "1 патрон",
    weight: "0.8 кг",
    length: "230 мм",
    effectiveRange: "100 м (для сигнальных ракет)",
    firingModes: "Одиночный выстрел",
    manufacturer: "Orion",
    additionalInfo: "Используется для подачи сигналов и освещения местности",
  },

  // Категория "A"
  "Colt 1911": {
    caliber: ".45 ACP",
    capacity: "11 патронов",
    weight: "1.1 кг",
    length: "216 мм",
    effectiveRange: "50 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Colt",
    additionalInfo: "Легендарный пистолет, находившийся на вооружении армии США более 70 лет",
  },
  "DESERT EAGLE": {
    caliber: ".50 Action Express",
    capacity: "7 патронов",
    weight: "1.8 кг",
    length: "270 мм",
    effectiveRange: "200 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Magnum Research/IMI",
    additionalInfo: "Один из самых мощных серийных пистолетов в мире",
  },
  Револьвер: {
    caliber: ".357 Magnum",
    capacity: "6 патронов",
    weight: "1.2 кг",
    length: "235 мм",
    effectiveRange: "50 м",
    firingModes: "Двойного действия",
    manufacturer: "Smith & Wesson",
    additionalInfo: "Классический револьвер с высокой надежностью",
  },
  "Револьвер MK II": {
    caliber: ".44 Magnum",
    capacity: "6 патронов",
    weight: "1.4 кг",
    length: "240 мм",
    effectiveRange: "100 м",
    firingModes: "Двойного действия",
    manufacturer: "Smith & Wesson",
    additionalInfo: "Улучшенная версия с усиленной рамкой и улучшенной эргономикой",
  },
  "Золотой револьвер": {
    caliber: ".44 Magnum",
    capacity: "6 патронов",
    weight: "1.5 кг",
    length: "240 мм",
    effectiveRange: "100 м",
    firingModes: "Двойного действия",
    manufacturer: "Smith & Wesson",
    additionalInfo: "Коллекционная версия с золотым покрытием и гравировкой",
  },

  // Категория "B"
  "MOSSBERG 590 A1": {
    caliber: "12 калибр",
    capacity: "8+1 патронов",
    weight: "3.2 кг",
    length: "1010 мм",
    effectiveRange: "40 м",
    firingModes: "Помповый",
    manufacturer: "Mossberg",
    additionalInfo: "Боевой дробовик, состоящий на вооружении армии и полиции США",
  },
  "Укороченный дробовик Serbu": {
    caliber: "12 калибр",
    capacity: "3 патрона",
    weight: "2.5 кг",
    length: "710 мм",
    effectiveRange: "20 м",
    firingModes: "Помповый",
    manufacturer: "Serbu Firearms",
    additionalInfo: "Компактный дробовик для ближнего боя",
  },
  Обрез: {
    caliber: "12 калибр",
    capacity: "2 патрона",
    weight: "2.3 кг",
    length: "500 мм",
    effectiveRange: "10 м",
    firingModes: "Двуствольный",
    manufacturer: "Кустарное производство",
    additionalInfo: "Модифицированное охотничье ружье с укороченным стволом",
  },
  Мушкет: {
    caliber: ".75 калибр",
    capacity: "1 патрон",
    weight: "4.5 кг",
    length: "1500 мм",
    effectiveRange: "100 м",
    firingModes: "Однозарядный",
    manufacturer: "Brown Bess",
    additionalInfo: "Историческое оружие XVIII-XIX веков",
  },
  "Дуэльный пистолет": {
    caliber: ".45 калибр",
    capacity: "1 патрон",
    weight: "1.3 кг",
    length: "380 мм",
    effectiveRange: "25 м",
    firingModes: "Однозарядный",
    manufacturer: "Thompson/Center",
    additionalInfo: "Современная реплика исторического дуэльного пистолета",
  },

  // Категория "C"
  "TEC-9": {
    caliber: "9×19мм Parabellum",
    capacity: "32 патрона",
    weight: "1.4 кг",
    length: "317 мм",
    effectiveRange: "50 м",
    firingModes: "Полуавтоматический",
    manufacturer: "Intratec",
    additionalInfo: "Компактный пистолет-пулемет с высокой скорострельностью",
  },
  Скорпион: {
    caliber: "9×18мм Makarov",
    capacity: "20 патронов",
    weight: "1.3 кг",
    length: "270/517 мм (со сложенным/разложенным прикладом)",
    effectiveRange: "150 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "CZ",
    additionalInfo: "Компактный пистолет-пулемет чешского производства",
  },
  "FN P90": {
    caliber: "5.7×28мм",
    capacity: "50 патронов",
    weight: "2.6 кг",
    length: "500 мм",
    effectiveRange: "200 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "FN Herstal",
    additionalInfo: "Компактный пистолет-пулемет с уникальной компоновкой",
  },
  MP5: {
    caliber: "9×19мм Parabellum",
    capacity: "30 патронов",
    weight: "2.5 кг",
    length: "680 мм",
    effectiveRange: "200 м",
    firingModes: "Одиночный, очередями по 3 выстрела, автоматический",
    manufacturer: "Heckler & Koch",
    additionalInfo: "Один из самых популярных пистолетов-пулеметов в мире",
  },
  "SGW Suppressor": {
    caliber: "9×19мм Parabellum",
    capacity: "30 патронов",
    weight: "2.8 кг",
    length: "800 мм (с глушителем)",
    effectiveRange: "150 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "SGW",
    additionalInfo: "Пистолет-пулемет со встроенным глушителем",
  },
  "MP5 MKII": {
    caliber: "9×19мм Parabellum",
    capacity: "30 патронов",
    weight: "2.6 кг",
    length: "700 мм",
    effectiveRange: "200 м",
    firingModes: "Одиночный, очередями по 3 выстрела, автоматический",
    manufacturer: "Heckler & Koch",
    additionalInfo: "Улучшенная версия MP5 с планками Пикатинни и улучшенной эргономикой",
  },
  THOMPSON: {
    caliber: ".45 ACP",
    capacity: "30 патронов (барабанный магазин)",
    weight: "4.9 кг",
    length: "850 мм",
    effectiveRange: "150 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Auto-Ordnance",
    additionalInfo: "Легендарный пистолет-пулемет времен Второй мировой войны",
  },

  // Категория "D"
  "AR-15/TX-15": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.0 кг",
    length: "990 мм",
    effectiveRange: "500 м",
    firingModes: "Полуавтоматический",
    manufacturer: "ArmaLite/Colt",
    additionalInfo: "Гражданская версия винтовки M16",
  },
  AK: {
    caliber: "7.62×39мм",
    capacity: "30 патронов",
    weight: "3.8 кг",
    length: "880 мм",
    effectiveRange: "400 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Калашников",
    additionalInfo: "Самый распространенный автомат в мире",
  },
  "Bullpup Rifle": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.6 кг",
    length: "770 мм",
    effectiveRange: "500 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Steyr",
    additionalInfo: "Компактная винтовка с компоновкой булл-пап",
  },
  "HK G36": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.6 кг",
    length: "999 мм",
    effectiveRange: "600 м",
    firingModes: "Одиночный, очередями по 3 выстрела, автоматический",
    manufacturer: "Heckler & Koch",
    additionalInfo: "Современная штурмовая винтовка с корпусом из полимеров",
  },
  "TAR-21": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.6 кг",
    length: "720 мм",
    effectiveRange: "500 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Israel Weapon Industries",
    additionalInfo: "Израильская штурмовая винтовка с компоновкой булл-пап",
  },
  АКСУ: {
    caliber: "5.45×39мм",
    capacity: "30 патронов",
    weight: "2.7 кг",
    length: "730 мм",
    effectiveRange: "300 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Калашников",
    additionalInfo: "Укороченная версия АК-74, разработанная для экипажей боевых машин",
  },
  "HK G36 MKII": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.7 кг",
    length: "1000 мм",
    effectiveRange: "600 м",
    firingModes: "Одиночный, очередями по 3 выстрела, автоматический",
    manufacturer: "Heckler & Koch",
    additionalInfo: "Улучшенная версия G36 с усовершенствованной системой охлаждения",
  },
  "M4 A1": {
    caliber: "5.56×45мм NATO",
    capacity: "30 патронов",
    weight: "3.1 кг",
    length: "840 мм (с разложенным прикладом)",
    effectiveRange: "500 м",
    firingModes: "Одиночный, автоматический",
    manufacturer: "Colt",
    additionalInfo: "Укороченная версия винтовки M16, стоящая на вооружении армии США",
  },
}

const weaponCategories = [
  {
    name: "Покупка БЕЗ лицензии",
    items: [
      { name: "Выкидной нож", price: 450, image: "/images/flick-knife.png" },
      { name: "Армейский нож M9", price: 910, image: "/images/army-knife-m9.png" },
      { name: "Кавалерийский кинжал", price: 910, image: "/images/cavalry-dagger.png" },
      { name: "Мачете", price: 1010, image: "/images/machete.png" },
      { name: "Кастет", price: 155, image: "/images/brass-knuckles.png" },
      { name: "Бейсбольная бита", price: 155, image: "/images/pinch-bar.png" },
      { name: "Клюшка для гольфа", price: 450, image: "/images/golf-hockey-stick.png" },
      { name: "Бильярдный кий", price: 100, image: "/images/billiard-cue.png" },
      { name: "Молоток", price: 255, image: "/images/hammer.png" },
      { name: "Монтировка", price: 660, image: "/images/crowbar.png" },
      { name: "Развадной ключ", price: 535, image: "/images/adjustable-spanner.png" },
      { name: "Фонарик", price: 115, image: "/images/flashlight.png" },
      { name: "Топор", price: 420, image: "/images/axe.png" },
      { name: "Томагавк", price: 560, image: "/images/battle-axe.png" },
      { name: "Заправка огнетушителя", price: 150, image: "/images/fire-extinguisher-refill.png" },
      { name: "Канистра", price: 70, image: "/images/jerrycan.png" },
    ],
  },
  {
    name: 'Категория "9мм"',
    items: [
      { name: "Карманный пистолет", price: 2300, ammo: "Патроны 12шт/55$", image: "/images/pocket-pistol.png" },
      { name: "BERETTA M9", price: 4100, ammo: "Патроны 12шт/55$", image: "/images/beretta-m9.png" },
      { name: "SIG Sauer P250", price: 6300, ammo: "Патроны 12шт/55$", image: "/images/sig-sauer-p250.png" },
      { name: "Glock - 17", price: 7900, ammo: "Патроны 12шт/55$", image: "/images/glock-17.png" },
      { name: "Винтажный пистолет", price: 8600, ammo: "Патроны 12шт/55$", image: "/images/vintage-pistol.png" },
      { name: "Сигнальный пистолет", price: 3400, ammo: "Патроны 12шт/130$", image: "/images/orion-flare-gun.png" },
    ],
  },
  {
    name: 'Категория "A"',
    items: [
      { name: "Colt 1911", price: 9000, ammo: "Патроны 12шт/36$", image: "/images/colt1911.png" },
      { name: "DESERT EAGLE", price: 15300, ammo: "Патроны 12шт/36$", image: "/images/desert-eagle.png" },
      { name: "Револьвер", price: 45000, ammo: "Патроны 12шт/36$", image: "/images/revolver.png" },
      { name: "Револьвер MK II", price: 55500, ammo: "Патроны 12шт/36$", image: "/images/revolver-mk-ii.png" },
      { name: "Золотой револьвер", price: 75000, ammo: "Патроны 12шт/36$", image: "/images/gold-revolver.png" },
    ],
  },
  {
    name: 'Категория "B"',
    items: [
      { name: "MOSSBERG 590 A1", price: 22500, ammo: "Патроны 12шт/70$", image: "/images/mossberg-590-a1.png" },
      { name: "Укороченный дробовик Serbu", price: 13500, ammo: "Патроны 12шт/70$", image: "/images/serbu.png" },
      { name: "Обрез", price: 10500, ammo: "Патроны 12шт/70$", image: "/images/sawed-off-shotgun.png" },
      { name: "Мушкет", price: 6800, ammo: "Патроны 12шт/70$", image: "/images/flintlock-rifle.png" },
      { name: "Дуэльный пистолет", price: 8300, ammo: "Патроны 12шт/70$", image: "/images/contender.png" },
    ],
  },
  {
    name: 'Категория "C"',
    items: [
      { name: "TEC-9", price: 19500, ammo: "Патроны 12шт/70$", image: "/images/tec-9.png" },
      { name: "Скорпион", price: 24800, ammo: "Патроны 12шт/70$", image: "/images/skorpion.png" },
      { name: "FN P90", price: 23300, ammo: "Патроны 12шт/70$", image: "/images/fn-p90.png" },
      { name: "MP5", price: 22800, ammo: "Патроны 12шт/70$", image: "/images/mp5.png" },
      { name: "SIG Sauer MPX-SD", price: 30300, ammo: "Патроны 12шт/70$", image: "/images/sgw-suppressor.png" },
      { name: "MP5 MKII", price: 34500, ammo: "Патроны 12шт/70$", image: "/images/mp5-mkii.png" },
      { name: "THOMPSON", price: 28900, ammo: "Патроны 12шт/70$", image: "/images/thompson.png" },
    ],
  },
  {
    name: 'Категория "D"',
    items: [
      { name: "AR-15/TX-15", price: 135000, ammo: "Патроны 12шт/70$", image: "/images/ar-15-tx-15.png" },
      { name: "AK", price: 49400, ammo: "Патроны 12шт/70$", image: "/images/ak.png" },
      { name: "Bullpup Rifle", price: 51000, ammo: "Патроны 12шт/70$", image: "/images/bullpup-rifle.png" },
      { name: "HK G36", price: 52500, ammo: "Патроны 12шт/70$", image: "/images/hk-g36.png" },
      { name: "TAR-21", price: 52500, ammo: "Патроны 12шт/70$", image: "/images/tar-21.png" },
      { name: "АКСУ", price: 54000, ammo: "Патроны 12шт/70$", image: "/images/aksu.png" },
      { name: "HK G36 MKII", price: 58500, ammo: "Патроны 12шт/70$", image: "/images/hk-g36-mkii.png" },
      { name: "M4A3", price: 49500, ammo: "Патроны 12шт/70$", image: "/images/m4-a1.png" },
    ],
  },
]

export default function Catalog() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-lg" asChild>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc8rM6_-p5z7AtCis2nND5fOiWxWTdy4us7FRN9HOTUHxbNnQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Оформить заказ онлайн
            </a>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Каталог оружия</h1>
        {weaponCategories.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white p-4 rounded-lg shadow-md">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain bg-white mb-4 rounded border"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    {/* Only show tooltip for firearms (not for items in the first category) */}
                    {index > 0 && weaponSpecs[item.name] && <WeaponTooltip specs={weaponSpecs[item.name]} />}
                  </div>
                  <p className="text-gray-600 mb-2">Цена: ${item.price}</p>
                  {item.ammo && <p className="text-gray-500 mb-4">{item.ammo}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
