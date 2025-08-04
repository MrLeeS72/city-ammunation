import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import type { ReactNode } from "react"

interface WeaponTooltipProps {
  children: ReactNode
  name: string
  description: string
  price: number
  image: string
  ammoPrice?: number
}

export function WeaponTooltip({ children, name, description, price, image, ammoPrice }: WeaponTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4 mb-3">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={64}
              height={64}
              className="object-contain rounded-md"
            />
            <div>
              <h4 className="text-lg font-bold text-red-700">{name}</h4>
              <p className="text-gray-800 font-semibold">${price.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          {ammoPrice !== undefined && (
            <p className="text-xs text-gray-500">Патроны: ${ammoPrice.toLocaleString()} за пачку</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
