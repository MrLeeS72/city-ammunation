"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, ZoomIn, ZoomOut, Move } from "lucide-react"

export default function Contacts() {
  /* ---------- simple pan / zoom logic for the static map ---------- */
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5))

  /* ---------- mouse / touch handlers ---------- */
  const startDrag = (x: number, y: number) => {
    setIsDragging(true)
    setDragStart({ x: x - position.x, y: y - position.y })
  }

  const onMouseDown = (e: React.MouseEvent) => startDrag(e.clientX, e.clientY)
  const onTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX, e.touches[0].clientY)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const stopDrag = () => setIsDragging(false)

  /* reset panning when we return to default zoom */
  useEffect(() => {
    if (scale === 1) setPosition({ x: 0, y: 0 })
  }, [scale])

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">Контакты</h1>

        {/* ------- LOCATION CARD ------- */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-red-600" />
              КАК НАС НАЙТИ?
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="font-bold">Ammu-Nation находится по адресу:</p>
            <p>Cypress Flats, Popular Street, 9275</p>

            {/* interactive map */}
            <div
              className="mt-4 relative w-full overflow-hidden rounded-lg border border-gray-200"
              style={{ height: "400px" }}
            >
              <div
                ref={containerRef}
                className="relative w-full h-full cursor-move"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={stopDrag}
              >
                <div
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                >
                  <Image
                    src="/images/los-santos-detailed-map.png"
                    alt="Детальная карта Лос-Сантоса"
                    fill
                    className="object-contain rounded-lg select-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* zoom buttons */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  aria-label="Приблизить"
                  onClick={zoomIn}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  aria-label="Отдалить"
                  onClick={zoomOut}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <ZoomOut className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* helper tooltip */}
              <div className="absolute top-4 left-4 bg-white/80 px-2 py-1 rounded text-sm flex items-center">
                <Move className="h-4 w-4 mr-1" /> Перетаскивайте для навигации
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2 italic">Детальная карта Лос-Сантоса с указанием районов и улиц</p>
          </CardContent>
        </Card>

        {/* ------- CONTACTS CARD ------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-red-600" />
              Свяжитесь с нами
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              <li>Jerry — 735-2879</li>
              <li>Jared — 262-7153</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
