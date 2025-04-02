//This Apps Script is associated with the following Google Sheet
//https://docs.google.com/spreadsheets/d/1xEdLmH4W5zYXY65T7SfDHQWkBpoSarJLyhQLpAnUktk/edit?gid=0#gid=0
//Both the script and the sheet can be copied and manipulated to fit your needs.

function onEdit() {
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    for (var i = 3; i < sheets.length ; i++ ) {
        var sheet = sheets[i];
        var val = sheet.getRange("A1").getValue();
        if(sheet.getName() !== val) sheet.setName(val)
        }       
    }

function toastMessageTimeout() {
  SpreadsheetApp.getActive().toast("Remember to use the Email for Help! option in the menu bar if you run into trouble!!", "CB Collection", 20 );
}

function sendEmail() {
  var emailRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SchoolData").getRange("B7");
  var recipient = emailRange.getValue();
  var rangeTwo = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SchoolData").getRange("B10");
  var carbon = rangeTwo.getValue();
  var subject = "Chomebook Collection Help!";
  var body = "I need some help with the 2024 Chromebook Collection!";
  //var options = {
  //  cc: carbon,
  //}
  MailApp.sendEmail(recipient, subject, body, {
    cc: carbon
    });
  SpreadsheetApp.getUi().alert('An email has been sent! Help is on the way!');
}

function remaining() {
  SpreadsheetApp.getActive().getSheetByName("Totals").activate();
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var sheetSheet = spread.getSheetByName("Totals");
  var range = sheetSheet.getRange("G18");
  var data = range.getValue();
  var range2 = sheetSheet.getRange("D18");
  var data2 = range2.getValue(); 
  Browser.msgBox('Remaining', 'There are ' + data + ' Chromebooks remaining. We have collected ' + data2 + ' Chromebooks thus far.', Browser.Buttons.OKAY_CANCEL);
  }



