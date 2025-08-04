function doPost(e) {
  let responseData; // Переменная для хранения данных ответа

  try {
    // Проверяем, что e.postData существует и имеет содержимое
    if (!e || !e.postData || !e.postData.contents) {
      responseData = { success: false, error: "Отсутствуют данные POST-запроса." };
    } else {
      const data = JSON.parse(e.postData.contents);
      // !!! ЗАМЕНИТЕ ЭТОТ ID НА ID ВАШЕЙ GOOGLE ТАБЛИЦЫ !!!
      const SPREADSHEET_ID = "1xgW9H8_wNPVSf7h7HmcOd513wjyD2T_2H7KMWnCKSQY"; 
      // !!! ЗАМЕНИТЕ ЭТО ИМЯ НА ИМЯ ЛИСТА В ВАШЕЙ ТАБЛИЦЕ !!!
      const SHEET_NAME = "Заказы Ammu-Nation"; 

      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

      if (!sheet) {
        responseData = { success: false, error: "Лист не найден. Проверьте имя листа." };
      } else {
        // Проверяем, есть ли заголовок, и добавляем его, если нет
        if (sheet.getLastRow() === 0) {
          sheet.appendRow([
            "Дата Заказа (Клиент)",
            "Дата Получения (Сервер)",
            "Имя",
            "Фамилия",
            "Телефон",
            "ID Карта",
            "Discord Никнейм",
            "Детали Заказа",
            "Общая Сумма",
          ]);
        }

        const orderReceivedAt = Utilities.formatDate(new Date(), "GMT+3", "dd.MM.yyyy HH:mm:ss");
        const customer = data.customerInfo || {};
        const items = data.items || [];

        if (!customer.firstName || items.length === 0) {
          responseData = { success: false, error: "Некорректные данные заказа: отсутствует имя клиента или товары." };
        } else {
          const itemsString = items.map(item => {
            let line = `${item.name} x${item.quantity} (${item.price}₽)`;
            if (item.ammoQuantity && item.ammoPrice) {
              line += ` + патроны x${item.ammoQuantity} (${item.ammoPrice}₽)`;
            }
            return line;
          }).join("; ");

          sheet.appendRow([
            data.orderDate,
            orderReceivedAt,
            customer.firstName,
            customer.lastName,
            customer.phone,
            customer.idCard,
            customer.discordNickname,
            itemsString,
            data.totalPrice,
          ]);
          responseData = { success: true };
        }
      }
    }
  } catch (error) {
    console.error("Ошибка doPost:", error);
    responseData = { success: false, error: error.toString() };
  }

  // Всегда возвращаем ответ с заголовком CORS
  // Явное присвоение переменной для обхода потенциальных проблем с цепочкой вызовов
  let output = ContentService.createTextOutput(JSON.stringify(responseData));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader("Access-Control-Allow-Origin", "*");
  return output;
}

// Эта функция нужна для обработки OPTIONS (pre-flight) запросов,
// которые браузеры отправляют перед POST-запросами для проверки CORS.
// Она должна возвращать 200 OK и заголовок Access-Control-Allow-Origin.
function doGet(e) {
  let output = ContentService.createTextOutput(JSON.stringify({ success: true, message: "GET request received" }));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader("Access-Control-Allow-Origin", "*");
  return output;
}
