// Increase or decrease all font sizes in a selection by 1 point
function adjustFontSize(increase) {
  var selection = DocumentApp.getActiveDocument().getSelection();

  if (!selection) {
    Logger.log("No text selected.");
    return;
  }

  var elements = selection.getRangeElements();

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i].getElement();

    if (element.getType() == DocumentApp.ElementType.PARAGRAPH ||
        element.getType() == DocumentApp.ElementType.LIST_ITEM ||
        element.getType() == DocumentApp.ElementType.TABLE_CELL) {
      adjustElementFontSize(element, increase);
    } else if (element.getType() == DocumentApp.ElementType.TEXT) {
      var text = element.asText();
      var startOffset = elements[i].getStartOffset();
      var endOffset = elements[i].getEndOffsetInclusive();

      if (startOffset == -1 || endOffset == -1) {
        continue;
      }
      
      for (var j = startOffset; j <= endOffset; j++) {
        var currentSize = text.getFontSize(j);
        if (currentSize) {
          var newSize = increase ? currentSize + 1 : currentSize - 1;
          text.setFontSize(j, j, newSize);
        }
      }
    }
  }
}

function adjustElementFontSize(element, increase) {
  var text = element.asText();
  var length = text.getText().length;

  if (length > 0) {
    var currentSize = text.getFontSize(0);
    if (currentSize) {
      var newSize = increase ? currentSize + 1 : currentSize - 1;
      text.setFontSize(newSize);
    }
  }
}

// Increase font size by 1
function increaseFontSize() {
  adjustFontSize(true);
}

// Decrease font size by 1
function decreaseFontSize() {
  adjustFontSize(false);
}

// Add custom menu
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Font Adjuster')
    .addItem('Increase Font Size', 'increaseFontSize')
    .addItem('Decrease Font Size', 'decreaseFontSize')
    .addToUi();
}
