"use client"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeaponSpecsProps {
  specs: {
    caliber?: string
    capacity?: string
    weight?: string
    length?: string
    effectiveRange?: string
    firingModes?: string
    manufacturer?: string
    additionalInfo?: string
  }
}

export default function WeaponTooltip({ specs }: WeaponSpecsProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-red-100 border-red-200 hover:bg-red-200 hover:text-red-800"
          >
            <Info className="h-3 w-3 text-red-600" />
            <span className="sr-only">Тактико-технические характеристики</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-black text-white p-4 rounded-md shadow-lg border-0">
          <div className="space-y-2 text-sm">
            <h4 className="font-bold text-red-400 mb-2">Характеристики:</h4>
            {specs.caliber && (
              <p>
                <span className="font-semibold">Калибр:</span> {specs.caliber}
              </p>
            )}
            {specs.capacity && (
              <p>
                <span className="font-semibold">Ёмкость магазина:</span> {specs.capacity}
              </p>
            )}
            {specs.weight && (
              <p>
                <span className="font-semibold">Вес:</span> {specs.weight}
              </p>
            )}
            {specs.length && (
              <p>
                <span className="font-semibold">Длина:</span> {specs.length}
              </p>
            )}
            {specs.effectiveRange && (
              <p>
                <span className="font-semibold">Эффективная дальность:</span> {specs.effectiveRange}
              </p>
            )}
            {specs.firingModes && (
              <p>
                <span className="font-semibold">Режимы стрельбы:</span> {specs.firingModes}
              </p>
            )}
            {specs.manufacturer && (
              <p>
                <span className="font-semibold">Производитель:</span> {specs.manufacturer}
              </p>
            )}
            {specs.additionalInfo && (
              <p>
                <span className="font-semibold">Дополнительно:</span> {specs.additionalInfo}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
