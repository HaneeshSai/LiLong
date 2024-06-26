const { google } = require("googleapis");
const path = require("path");
const { createReadStream } = require("fs");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Function to upload a file to Google Drive
async function uploadToDrive(filePath) {
  try {
    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY,
      SCOPES
    );
    await jwtClient.authorize();

    const drive = google.drive({ version: "v3", auth: jwtClient });

    const file = await drive.files.create({
      media: {
        body: createReadStream(filePath),
      },
      fields: "id",
      requestBody: {
        name: path.basename(filePath),
      },
    });

    console.log(`File uploaded to Google Drive. File ID: ${file.data.id}`);
    return file.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
  }
}

// Export the uploadToDrive function
module.exports = uploadToDrive;
