"use client"

import type React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface WeaponTooltipProps {
  weapon: {
    name: string
    image: string
    description: string
    price: number
    category: string
    damage: number
    fireRate: number
    accuracy: number
    range: number
  }
  children: React.ReactNode
}

export default function WeaponTooltip({ weapon, children }: WeaponTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="w-80 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex items-center mb-3">
            <Image
              src={weapon.image || "/placeholder.svg"}
              alt={weapon.name}
              width={64}
              height={64}
              className="object-contain mr-3"
            />
            <div>
              <h3 className="text-xl font-bold text-red-600">{weapon.name}</h3>
              <p className="text-sm text-gray-500">{weapon.category}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{weapon.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Цена:</span>
              <span>${weapon.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Урон:</span>
              <span>{weapon.damage}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Скорострельность:</span>
              <span>{weapon.fireRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Точность:</span>
              <span>{weapon.accuracy}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Дальность:</span>
              <span>{weapon.range}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
