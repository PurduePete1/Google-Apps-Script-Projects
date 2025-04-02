function onOpen() {
var ui = SpreadsheetApp.getUi();
  ui.createMenu('CB Collection')
    .addItem('Chromebooks Remaining?', 'main')
    .addItem('Email for Help!', 'main2')
    .addToUi()
toastMessageTimeout();
}

function main() {
  remaining()
}

function main2() {
  sendEmail()
}


