function onFormSubmit(e) {
  // Get form responses
  var responses = e.values;

  // Extract relevant data from the form responses
  var recipientEmail = responses[3]; // Assuming email is in the fourth column of the response sheet (column D)
  var recipientName = responses[2]; // Assuming recipient's name is in the third column of the response sheet (column C)
  var senderName = responses[1]; //Assuming sender's name is in the 

  // Get the Gmail draft template by name
  var templateName = "shoutOut"; // Replace with the name of your Gmail draft template
  var template = getGmailTemplateByName(templateName);

  // Replace placeholders in the template with actual data
  var body = replacePlaceholders(template.getBody(), recipientName, responses);

  // Send email
  GmailApp.sendEmail({
    to: recipientEmail,
    subject: 'You received a Squire Shout-Out', // Replace with your desired subject
    htmlBody: body
  });
}

// Function to replace placeholders in the Gmail template
function replacePlaceholders(body, recipientName, responses) {
  // Replace the recipient's name placeholder
  var namePlaceholder = "{{recipientName}}"; // Replace with the actual placeholder in your Gmail template
  body = body.replace(namePlaceholder, recipientName);

  // Replace other placeholders with actual form responses
  for (var i = 0; i < responses.length; i++) {
    var placeholder = "{{" + (i + 1) + "}}"; // Assuming placeholders in the template are {{1}}, {{2}}, ...
    body = body.replace(placeholder, responses[i]);
  }

  return body;
}

// Function to get Gmail draft template by name
function getGmailTemplateByName(templateName) {
  // Get all drafts
  var drafts = GmailApp.getDrafts();

  // Loop through drafts to find the template by name
  for (var i = 0; i < drafts.length; i++) {
    if (drafts[i].getName() === templateName) {
      return drafts[i];
    }
  }

  // If template not found, handle accordingly (throw an error, log, etc.)
  throw new Error("Gmail draft template not found: " + templateName);
}
