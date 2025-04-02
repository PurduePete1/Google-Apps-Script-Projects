function testFetchForms() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
    if (!sheet) {
        Logger.log("Sheet 'Dashboard' not found.");
        return;
    }

    var data = sheet.getDataRange().getValues();
    Logger.log("Raw Data from Sheet: " + JSON.stringify(data));

    if (data.length <= 1) {
        Logger.log("No form data found.");
        return;
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

    Logger.log("Formatted Response: " + JSON.stringify(response));
}