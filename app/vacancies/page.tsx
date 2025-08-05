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

export default function VacanciesPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    experience: "",
    skills: "",
    coverLetter: "",
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
    console.log("Заявка на вакансию:", formData)
    // Здесь можно добавить логику отправки данных, например, на API
    alert("Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.")
    setFormData({
      name: "",
      phone: "",
      email: "",
      position: "",
      experience: "",
      skills: "",
      coverLetter: "",
      agreeTerms: false,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Вакансии</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Открытые вакансии</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Продавец-консультант</h3>
                <p className="text-gray-700 text-sm">
                  Требования: опыт работы в продажах, знание ассортимента оружия, коммуникабельность.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Инструктор тира</h3>
                <p className="text-gray-700 text-sm">
                  Требования: опыт работы инструктором, действующая лицензия на оружие, умение обучать.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Специалист по лицензированию</h3>
                <p className="text-gray-700 text-sm">
                  Требования: знание законодательства об оружии, опыт работы с документами, внимательность.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Подать заявку</CardTitle>
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
              <div>
                <Label htmlFor="position">Интересующая позиция</Label>
                <Select
                  name="position"
                  value={formData.position}
                  onValueChange={(value) => handleSelectChange("position", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите позицию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_consultant">Продавец-консультант</SelectItem>
                    <SelectItem value="range_instructor">Инструктор тира</SelectItem>
                    <SelectItem value="licensing_specialist">Специалист по лицензированию</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Опыт работы (лет)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="skills">Ключевые навыки</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Перечислите ваши основные навыки, релевантные для вакансии."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="coverLetter">Сопроводительное письмо (необязательно)</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Расскажите о себе и почему вы хотите работать у нас."
                  rows={5}
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
                <Label htmlFor="agreeTerms">Я согласен с обработкой персональных данных</Label>
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
