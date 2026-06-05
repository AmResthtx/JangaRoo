/**
 * Cold Creek Ranch – Lead Capture
 * Paste this entire file into Google Apps Script (script.google.com),
 * then deploy as a Web App (anyone can access, run as you).
 * Copy the Web App URL into index.html → SHEET_URL constant.
 */

const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      data.submitted_at  || new Date().toLocaleString(),
      data.name          || '',
      data.phone         || '',
      data.email         || '',
      data.animals       || '',
      data.budget        || '',
      data.proof_of_funds|| '',
      data.message       || '',
    ]);
  } catch (err) {
    // silently log — no-cors callers can't read error responses anyway
    Logger.log('Error: ' + err.message);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Submitted At', 'Name', 'Phone', 'Email',
      'Animal(s) Interested', 'Budget', 'Proof of Funds', 'Message'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Optional: test by running this function manually in the Apps Script editor
function testPost() {
  doPost({
    postData: {
      contents: JSON.stringify({
        name: 'Test Buyer',
        phone: '555-000-0000',
        email: 'test@example.com',
        animals: 'Zebra Crossbreeds, Donkeys',
        budget: '$15,000 – $50,000',
        proof_of_funds: 'Cash buyer – can show proof on request',
        message: 'Test submission',
        submitted_at: new Date().toLocaleString(),
      })
    }
  });
}
