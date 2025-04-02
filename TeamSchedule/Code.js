// This file was used to sort the Master Practice Schedule for all CNMS Squire Basketball Teams for thr 2024-2025 Basketball Season. 
//Here is a viewable sheet link: 
//https://docs.google.com/spreadsheets/d/1jMNXYTQc8AIrY03x3x0LHkaQZZ9mgi55nDFn0XmkbO4/edit?usp=sharing

function onEdit(e) {
  // Log the event to see if it is triggered
  Logger.log("onEdit Triggered");

  // Make sure the event object exists and has the necessary properties
  if (!e || !e.range || !e.source) {
    Logger.log("Event object is undefined.");
    return;
  }
  
  var sheet = e.source.getActiveSheet();
  
  // Log which sheet and cell were edited
  Logger.log("Edited sheet: " + sheet.getName());
  Logger.log("Edited cell: " + e.range.getA1Notation());
  
  // Ensure the edit happened in "Sheet3" and specifically in cell B2
  if (sheet.getName() === 'Individual' && e.range.getA1Notation() === 'B2') {
    var teamName = e.range.getValue();  // Get the selected team name from the dropdown
    
    // Log the selected team
    Logger.log("Selected Team: " + teamName);

    // Call the function to update the schedule based on the selected team
    getTeamSchedule(teamName);
  }
}




function getTeamSchedule(teamName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master');
  var outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Individual');
  
  // Define the ranges to match your data, starting from row 2 (skip header)
  var dayRange = sheet.getRange('A2:A250').getValues();
  var dateRange = sheet.getRange('B2:B250').getValues();
  var gymRange = sheet.getRange('C2:C250').getValues();
  
  var earlyTeams = sheet.getRange('E2:E250').getValues();
  var midTeams = sheet.getRange('G2:G250').getValues();
  var lateTeams = sheet.getRange('I2:I250').getValues();
  
  // Clear previous schedule on Sheet3
  outputSheet.getRange('A5:D').clear();
  
  var schedule = [];
  
  // Helper function to convert day abbreviations to full day names
  function convertDay(day) {
    switch(day) {
      case 'M': return 'Monday';
      case 'T': return 'Tuesday';
      case 'W': return 'Wednesday';
      case 'TH': return 'Thursday';
      case 'F': return 'Friday';
      default: return day;
    }
  }

  // Adjust loop to start from 0 (since the range now starts at row 2)
  for (var i = 0; i < dayRange.length; i++) {
    var gym = '';
    var time = '';
    
    // Check if the team is in the early slot
    if (earlyTeams[i][0] === teamName) {
      gym = gymRange[i][0];
      time = '2:40-4:05';
    }
    
    // Check if the team is in the middle slot
    else if (midTeams[i][0] === teamName) {
      gym = gymRange[i][0];
      time = '4:10-5:35';
    }
    
    // Check if the team is in the late slot
    else if (lateTeams[i][0] === teamName) {
      gym = gymRange[i][0];
      time = '5:40-7:05';
    }
    
    // If a match was found, add the entry to the schedule array
    if (gym !== '') {
      // Convert the day abbreviation to full name before adding to schedule
      var fullDayName = convertDay(dayRange[i][0]);
      schedule.push([fullDayName, dateRange[i][0], gym, time]);
    }
  }
  
  // Write the schedule to Sheet3 starting at row 5
  if (schedule.length > 0) {
    var outputRange = outputSheet.getRange(5, 1, schedule.length, schedule[0].length);
    outputRange.setValues(schedule);
    
    // Center align all the pulled data
    outputRange.setHorizontalAlignment('center');
  }
}
