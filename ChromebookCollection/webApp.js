function doGet() {
  var sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var htmlOutput = HtmlService.createHtmlOutput('<table border="1">');
  
  for (var row = 0; row < data.length; row++) {
    htmlOutput.append('<tr>');
    
    for (var col = 0; col < data[row].length; col++) {
      htmlOutput.append('<td>' + data[row][col] + '</td>');
    }
    
    htmlOutput.append('</tr>');
  }
  
  htmlOutput.append('</table>');
  
  return htmlOutput;
}
