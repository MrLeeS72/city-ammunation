"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type React from "react"

interface Weapon {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  ammoPrice?: number
}

interface WeaponTooltipProps {
  weapon: Weapon
  children: React.ReactNode
}

export default function WeaponTooltip({ weapon, children }: WeaponTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-gray-800 text-white rounded-lg shadow-lg">
          <h4 className="font-bold text-lg mb-1">{weapon.name}</h4>
          <p className="text-sm text-gray-300 mb-2">{weapon.category}</p>
          <p className="text-md mb-2">{weapon.description}</p>
          <p className="font-semibold text-red-400">Цена: ${weapon.price}</p>
          {weapon.ammoPrice && <p className="text-sm text-gray-400">Патроны: ${weapon.ammoPrice} за пачку</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
