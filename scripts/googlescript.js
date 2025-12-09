// ✅ CELEBRITY BOOKING BACKEND (Google Apps Script)
// Make sure your Sheet tab name = "Sheet1"

function doGet(e) {
    return ContentService
      .createTextOutput("✅ Celebrity Booking API is live — use POST to submit data.")
      .setMimeType(ContentService.MimeType.TEXT);
  }
  
  function doPost(e) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
      const data = e.parameter;
      const ref = "CBK-" + Math.floor(Math.random() * 1000000);
      const timestamp = new Date();
  
      // ✅ Append booking data to the sheet
      sheet.appendRow([
        timestamp,
        ref,
        data.name,
        data.email,
        data.phone,
        data.country,
        data.state,
        data.eventType,
        data.eventClass,
        data.eventVenue || "N/A"
      ]);
  
      // ✅ Send confirmation emails
      sendBookingEmail(data, ref, timestamp);
  
      return ContentService
        .createTextOutput("Booking received successfully.")
        .setMimeType(ContentService.MimeType.TEXT);
  
    } catch (err) {
      Logger.log("Error in doPost: " + err);
      return ContentService
        .createTextOutput("Error: " + err)
        .setMimeType(ContentService.MimeType.TEXT);
    }
  }
  
  function sendBookingEmail(data, ref, timestamp) {
    const adminEmail = "jenifer.lopez.mgt.usa@gmail.com"; // ✅ your admin email
    const logoUrl = "https://drive.google.com/uc?export=view&id=1zHdVKseXCP4WIONeisHSVTAkKmu_01jt"; // ✅ your logo
  
    const subject = `Booking Confirmation - ${data.name}`;
    const htmlBody = `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
      <div style="background:linear-gradient(120deg,#5c00b8,#001f80);color:white;padding:20px;text-align:center;">
        <img src="${logoUrl}" alt="Logo" style="max-width:100px;margin-bottom:10px;">
        <h2>Celebrity Booking Confirmation</h2>
      </div>
      <div style="padding:20px;">
        <p>Dear <b>${data.name}</b>,</p>
        <p>Thank you for your booking request. Here are your booking details:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td><b>Booking Reference:</b></td><td>${ref}</td></tr>
          <tr><td><b>Date:</b></td><td>${timestamp}</td></tr>
          <tr><td><b>Name:</b></td><td>${data.name}</td></tr>
          <tr><td><b>Email:</b></td><td>${data.email}</td></tr>
          <tr><td><b>Phone:</b></td><td>${data.phone}</td></tr>
          <tr><td><b>Country:</b></td><td>${data.country}</td></tr>
          <tr><td><b>State:</b></td><td>${data.state}</td></tr>
          <tr><td><b>Event Type:</b></td><td>${data.eventType}</td></tr>
          <tr><td><b>Event Class:</b></td><td>${data.eventClass}</td></tr>
          <tr><td><b>Event Venue:</b></td><td>${data.eventVenue || "N/A"}</td></tr>
        </table>
        <p style="margin-top:20px;">We will contact you shortly to confirm all arrangements.</p>
        <p style="color:#555;">Best regards,<br><b>Celebrity Booking Team</b></p>
      </div>
      <div style="background:#f4f4f4;padding:10px;text-align:center;color:#666;font-size:12px;">
        © 2025 Celebrity Booking Agency. All rights reserved.
      </div>
    </div>
    `;
  
    // ✅ Generate and attach a PDF summary
    const pdfFile = generateBookingPDF(data, ref, timestamp);
  
    // ✅ Send confirmation email to user
    GmailApp.sendEmail(data.email, subject, "Please enable HTML to view this email.", {
      htmlBody: htmlBody,
      attachments: [pdfFile]
    });
  
    // ✅ Send a copy to admin
    GmailApp.sendEmail(adminEmail, `📋 New Booking — ${data.name}`, "See booking details below.", {
      htmlBody: htmlBody,
      attachments: [pdfFile]
    });
  }
  
  function generateBookingPDF(data, ref, timestamp) {
    const html = `
    <div style="font-family:Arial;">
      <h2 style="color:#4b0082;">Celebrity Booking Summary</h2>
      <p><b>Booking Ref:</b> ${ref}</p>
      <p><b>Date Booked:</b> ${timestamp}</p>
      <hr>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Country:</b> ${data.country}</p>
      <p><b>State:</b> ${data.state}</p>
      <p><b>Event Type:</b> ${data.eventType}</p>
      <p><b>Event Class:</b> ${data.eventClass}</p>
      <p><b>Event Venue:</b> ${data.eventVenue || "N/A"}</p>
    </div>
    `;
    const blob = Utilities.newBlob(html, "text/html", "Booking.html");
    return blob.getAs("application/pdf").setName(`Booking_${ref}.pdf`);
  }
  