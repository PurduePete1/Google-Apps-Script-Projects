function checkFontSizes() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  
  if (!selection) {
    Logger.log("No text selected.");
    return;
  }
  
  var elements = selection.getRangeElements();
  
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    
    if (element.getElement().getType() == DocumentApp.ElementType.TEXT) {
      var text = element.getElement().asText();
      var startOffset = element.getStartOffset();
      var endOffset = element.getEndOffsetInclusive();
      
      for (var j = startOffset; j <= endOffset; j++) {
        var currentSize = text.getFontSize(j);
        Logger.log("Character " + j + ": Font size = " + currentSize);
      }
    }
  }
}