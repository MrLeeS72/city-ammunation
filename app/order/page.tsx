import Header from '../components/Header'

export default function Order() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
        <p className="mb-4">Для оформления заказа, пожалуйста, заполните форму по ссылке ниже:</p>
        <a 
          href="https://docs.google.com/forms/d/e/your-form-id/viewform" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block"
        >
          Перейти к форме заказа
        </a>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
