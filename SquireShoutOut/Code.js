function sendEmails() {
  // Fetch the current sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Find the last row with data
  var lastRow = sheet.getLastRow();
  
  // Get the value in column H for the last row
  var timestamp = sheet.getRange(lastRow, 8).getValue();
  
  // If the timestamp is empty, it means the email hasn't been sent yet
  if (!timestamp) {

    //Get the sender's name from column C
    var senderName = sheet.getRange(lastRow, 3).getValue();

    // Get the email address from column E
    var emailAddress = sheet.getRange(lastRow, 5).getValue();
    
    // Get the recipient's name from column D
    var recipientName = sheet.getRange(lastRow, 4).getValue();
    
    // Get the body of the email from column G
    var message = sheet.getRange(lastRow, 7).getValue();

    // Use an HTML template for the email body
    var htmlTemplate = HtmlService.createTemplateFromFile('emailTemplate');
    htmlTemplate.recipient = recipientName;
    htmlTemplate.message = message;
    htmlTemplate.senderName = senderName; 
    var htmlBody = htmlTemplate.evaluate().getContent();
    
    // Send the email
    MailApp.sendEmail({
      to: emailAddress,
      subject: 'You Got a Squire Shout-Out!',
      htmlBody: htmlBody
    });
    
    // Add the current timestamp to column H
    sheet.getRange(lastRow, 8).setValue(new Date());
  }
}


