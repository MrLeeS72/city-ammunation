"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import Header from "../components/Header"

export default function ShootingRangePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    duration: "",
    weaponType: "",
    hasLicense: false,
    comment: "",
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Заявка на тир:", formData)
    // Здесь можно добавить логику отправки данных, например, на API
    alert("Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.")
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      duration: "",
      weaponType: "",
      hasLicense: false,
      comment: "",
      agreeTerms: false,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Запись в тир</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ваше имя</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email (необязательно)</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Детали записи</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Предполагаемая дата</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="time">Предполагаемое время</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="duration">Предполагаемая длительность (часы)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  required
                />
              </div>
              <div>
                <Label htmlFor="weaponType">Тип оружия</Label>
                <Select
                  name="weaponType"
                  value={formData.weaponType}
                  onValueChange={(value) => handleSelectChange("weaponType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип оружия" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pistol">Пистолет</SelectItem>
                    <SelectItem value="rifle">Винтовка</SelectItem>
                    <SelectItem value="shotgun">Дробовик</SelectItem>
                    <SelectItem value="smg">Пистолет-пулемет</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="hasLicense"
                  checked={formData.hasLicense}
                  onCheckedChange={(checked) => handleCheckboxChange("hasLicense", !!checked)}
                />
                <Label htmlFor="hasLicense">У меня есть лицензия на оружие</Label>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="comment">Комментарий (необязательно)</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Оставьте здесь любые дополнительные пожелания или вопросы."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", !!checked)}
                  required
                />
                <Label htmlFor="agreeTerms">Я согласен с условиями использования тира</Label>
              </div>
              <Button type="submit" onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
                Отправить заявку
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
