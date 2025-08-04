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
            "Order ID",
            "Date",
            "Customer Name",
            "Phone",
            "ID Card",
            "Discord Nickname",
            "Item Name",
            "Category",
            "Quantity",
            "Price",
            "Ammo Quantity",
            "Ammo Price",
            "Total Item Price",
            "Total Order Price"
          ]);
        }

        const orderId = "ORD-" + Utilities.getUuid().slice(0, 8); // Generate a simple order ID
        const orderDate = new Date().toLocaleString();
        const customerInfo = data.customerInfo;
        const items = data.items;
        const totalPrice = data.totalPrice;

        items.forEach(function(item) {
          var row = [
            orderId,
            orderDate,
            customerInfo.firstName + " " + customerInfo.lastName,
            customerInfo.phone,
            customerInfo.idCard,
            customerInfo.discordNickname,
            item.name,
            item.category,
            item.quantity,
            item.price,
            item.ammoQuantity || 0,
            item.ammoPrice || 0,
            (item.price * item.quantity + (item.ammoQuantity || 0) * (item.ammoPrice || 0)),
            totalPrice // Total order price is repeated for each item row for easier filtering
          ];
          sheet.appendRow(row);
        });

        responseData = { success: true, message: "Order received" };
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
