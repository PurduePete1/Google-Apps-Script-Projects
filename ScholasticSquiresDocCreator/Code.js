//This Apps Script is associated with the following Google Sheet
//https://docs.google.com/spreadsheets/d/1jiwsdJhmlQm5B_RpGjGrtRxqhA1bJZst8s3opu4kf04/edit?usp=sharing

//Candidate names go into Column A (beginning in A2)
//The Google Drive Folder where the created Docs will go needs to be entered into cell B2

// Google Template ID - 1RwMoSVo5ay8cFtb96TPb1lpQx72VHLnBIdQeMBmzMTI

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Document Generator")
        .addItem("Generate Individual PDFs", "generatePDFs")
        //.addItem("Generate One Mega PDF", "generateMegaPDF")
        .addToUi();
}

function generatePDFs() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var data = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
    var folderId = sheet.getRange("B2").getValue();

    if (!folderId) {
        SpreadsheetApp.getUi().alert("Error: Folder ID is missing in B2!");
        return;
    }

    var templateId = "1RwMoSVo5ay8cFtb96TPb1lpQx72VHLnBIdQeMBmzMTI"; // Replace with your Google Doc template ID
    var folder;
    try {
        folder = DriveApp.getFolderById(folderId);
    } catch (e) {
        SpreadsheetApp.getUi().alert("Error: Invalid Folder ID in B2. Please check and try again.");
        return;
    }

    var generatedCount = 0;
    data.forEach(function(row) {
        var candidateName = row[0];
        if (candidateName) {
            var docCopy = DriveApp.getFileById(templateId).makeCopy(candidateName + " Offer Letter", folder);
            var doc = DocumentApp.openById(docCopy.getId());
            var body = doc.getBody();
            body.replaceText("{{Candidate Name}}", candidateName);
            doc.saveAndClose();

            var pdfBlob = docCopy.getAs(MimeType.PDF);
            folder.createFile(pdfBlob.setName(candidateName + " Offer Letter.pdf"));

            docCopy.setTrashed(true);

            generatedCount++;
        }
    });

    SpreadsheetApp.getUi().alert(generatedCount + " PDFs have been created successfully!");
}

function generateMegaPDF() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var data = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
    var folderId = sheet.getRange("B2").getValue();

    if (!folderId) {
        SpreadsheetApp.getUi().alert("Error: Folder ID is missing in B2!");
        return;
    }

    var templateId = "1RwMoSVo5ay8cFtb96TPb1lpQx72VHLnBIdQeMBmzMTI"; // Your template ID
    var folder;
    try {
        folder = DriveApp.getFolderById(folderId);
    } catch (e) {
        SpreadsheetApp.getUi().alert("Error: Invalid Folder ID in B2. Please check and try again.");
        return;
    }

    // Create a copy of the template for the Mega Doc
    var megaDocFile = DriveApp.getFileById(templateId).makeCopy("Mega Candidate Offer Letters");
    var megaDoc = DocumentApp.openById(megaDocFile.getId());
    var megaBody = megaDoc.getBody();

    // Remove existing body content (so it's not duplicated)
    megaBody.clear();

    // Copy header while preserving formatting
    var templateDoc = DocumentApp.openById(templateId);
    var templateHeader = templateDoc.getHeader();
    var megaHeader = megaDoc.getHeader();

    if (templateHeader && megaHeader) {
        megaHeader.clear(); // Clear existing header
        for (var i = 0; i < templateHeader.getNumChildren(); i++) {
            var element = templateHeader.getChild(i).copy(); // Copy with formatting
            megaHeader.appendParagraph("").setText(element.asParagraph().getText()).setAttributes(element.asParagraph().getAttributes());
        }
    }

    // Append each candidate's information using the template format
    data.forEach(function(row, index) {
        var candidateName = row[0];
        if (candidateName) {
            var templateBody = templateDoc.getBody();

            // Copy each element while maintaining formatting
            for (var i = 0; i < templateBody.getNumChildren(); i++) {
                var element = templateBody.getChild(i).copy();

                if (element.getType() === DocumentApp.ElementType.PARAGRAPH) {
                    var paragraphText = element.asParagraph().getText().replace(/{{Candidate Name}}/g, candidateName);
                    megaBody.appendParagraph(paragraphText).setAttributes(element.asParagraph().getAttributes());
                } else if (element.getType() === DocumentApp.ElementType.TABLE) {
                    megaBody.appendTable(element.asTable());
                } else if (element.getType() === DocumentApp.ElementType.LIST_ITEM) {
                    megaBody.appendListItem(element.asListItem().getText()).setAttributes(element.asListItem().getAttributes());
                }
            }

            // Add a page break between candidates (except the last one)
            if (index < data.length - 1) {
                megaBody.appendPageBreak();
            }
        }
    });

    megaDoc.saveAndClose();

    // Convert the document to a PDF
    var pdfBlob = megaDocFile.getAs(MimeType.PDF);
    folder.createFile(pdfBlob.setName("All_Candidates_PDFs.pdf"));

    // Move the Google Doc into the folder (optional)
    folder.addFile(megaDocFile);
    DriveApp.getRootFolder().removeFile(megaDocFile); // Remove from My Drive

    SpreadsheetApp.getUi().alert("Mega PDF has been created successfully using your template!");
}
