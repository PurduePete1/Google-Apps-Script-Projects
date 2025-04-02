function authorizeAndDeploy() {
  var ui = SpreadsheetApp.getUi();

  // Step 1: Force authorization by accessing the sheet
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var testAccess = sheet.getSheets();
    ui.alert("✅ Authorization Successful! Now let's deploy the script.");
  } catch (e) {
    ui.alert("⚠️ Authorization Failed: Please grant permissions when prompted.");
    return;
  }

  // Step 2: Open the Google Apps Script deployment page
  ui.alert(
    "To finalize setup, follow these steps:\n\n" +
    "1️⃣ Click OK to open the Apps Script deployment settings.\n" +
    "2️⃣ In the top-right, click 'Deploy' > 'New Deployment'.\n" +
    "3️⃣ Under 'Select type', choose 'Web App'.\n" +
    "4️⃣ Set 'Who has access' to 'Anyone'.\n" +
    "5️⃣ Click 'Deploy', authorize, and copy the Web App URL.\n" +
    "6️⃣ Paste the Web App URL into the Vercel app.\n\n" +
    "Click OK to continue."
  );

  var scriptUrl = "https://script.google.com/home/projects/" + ScriptApp.getScriptId() + "/deployments";
  var html = '<script>window.open("' + scriptUrl + '", "_blank"); google.script.host.close();</script>';
  var output = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(output, "Open Deployment Page");
}
