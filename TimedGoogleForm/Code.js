//This Google Script is associated with the following Google Sheet
//https://docs.google.com/spreadsheets/d/1kfeu2E6_Qp5elYARPGLamx7Tbw4FRs05Es3W5zE-FC0/edit?gid=1390903085#gid=1390903085

function doGet(e) {
  try {
    var sheetId = e.parameter.sheetId;
    if (!sheetId) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Missing Sheet ID" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("Dashboard"); // Always fetch from "Dashboard"

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Sheet 'Dashboard' not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues(); // Get all rows including headers

    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No form data found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var response = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][1]) {
        response.push({
          formName: data[i][0],  
          formLink: data[i][1],  
          timeLimit: data[i][2] ? parseInt(data[i][2]) : 5  
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function authorizeAndSaveSheetID() {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet();
        var directionsSheet = sheet.getSheetByName("Directions");
        
        if (!directionsSheet) {
            directionsSheet = sheet.insertSheet("Directions");
        }
        
        // Access the spreadsheet (this forces authorization)
        var sheetID = sheet.getId();

        // Store the ID in the "Directions" sheet
        directionsSheet.getRange("D10").setValue(sheetID);
        
        // Notify the user
        SpreadsheetApp.getUi().alert("Authorization successful! Your Sheet ID is now saved.");
    } catch (e) {
        SpreadsheetApp.getUi().alert("Authorization failed. Please ensure pop-ups are allowed and try again.");
    }
}




