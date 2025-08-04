function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var newRow = JSON.parse(e.postData.contents);

  var headers = sheet.getDataRange().getValues()[0];
  var rowData = [];
  for (var i = 0; i < headers.length; i++) {
    rowData.push(newRow[headers[i]]);
  }

  sheet.appendRow(rowData);

  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data added" })).setMimeType(ContentService.MimeType.JSON);
}
