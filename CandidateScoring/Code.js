function tallyScores() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = ss.getSheetByName("Form Responses");
  const scoreSheet = ss.getSheetByName("Score");

  const rankColumns = [3, 4, 5, 6, 7, 8]; // C through H = 1st to 6th Choice
  const pointsByColumn = {
    3: 6, // C
    4: 5, // D
    5: 4, // E
    6: 3, // F
    7: 2, // G
    8: 1  // H
  };

  // Get all form response data from C2:H
  const lastRow = responseSheet.getLastRow();
  if (lastRow < 2) return; // No submissions
  const data = responseSheet.getRange(2, 3, lastRow - 1, 6).getValues(); // C-H

  // Get candidate names from Score sheet (B3:B)
  const candidatesRange = scoreSheet.getRange(3, 2, scoreSheet.getLastRow() - 2, 1); // B3:B...
  const candidates = candidatesRange.getValues().flat();

  const scoreMap = {};
  candidates.forEach(name => scoreMap[name] = 0);

  // Loop through each response row
  data.forEach(row => {
    row.forEach((name, colOffset) => {
      const colIndex = colOffset + 3; // Convert to actual column number (C=3)
      if (name && scoreMap.hasOwnProperty(name)) {
        scoreMap[name] += pointsByColumn[colIndex] || 0;
      }
    });
  });

  // Write scores back to column C in Score sheet (C3 down)
  candidates.forEach((name, i) => {
    scoreSheet.getRange(i + 3, 3).setValue(scoreMap[name]); // C3:C
  });

  // Sort B3:C by score (column C), descending
  const sortRange = scoreSheet.getRange(3, 2, candidates.length, 2);
  sortRange.sort({ column: 3, ascending: false });
}



function onFormSubmit(e) {
  tallyScores();
}