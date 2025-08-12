/**
 * qr-base64-decoder.js
 * 
 * Decodes Base64 payload from our QR code back into text and image files.
 * 
 * Run: node qr-base64-decoder.js
 */

const fs = require('fs');

/**
 * Decode Base64 string into original JSON
 * @param {string} base64Data 
 * @returns {object} Parsed JSON object
 */
function decodeBase64ToJson(base64Data) {
  const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
  return JSON.parse(jsonString);
}

/**
 * Save Base64 Data URI image to file
 * @param {string} dataUri 
 * @param {string} filename 
 */
function saveImageFromDataUri(dataUri, filename) {
  const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid Data URI format");

  const mimeType = matches[1];
  const ext = mimeType.split('/')[1];
  const imageBuffer = Buffer.from(matches[2], 'base64');

  fs.writeFileSync(`${filename}.${ext}`, imageBuffer);
  console.log(`✅ Saved image: ${filename}.${ext}`);
}

// ===== Example usage =====
// This `scannedResult` should be the text your QR scanner outputs.
// Paste the scanned text (the Base64 payload) here:
const scannedResult = "PASTE_YOUR_SCANNED_BASE64_HERE";

try {
  const decoded = decodeBase64ToJson(scannedResult);

  console.log("📄 Text content:", decoded.text);

  decoded.images.forEach((imgData, index) => {
    saveImageFromDataUri(imgData, `decoded_image_${index + 1}`);
  });

  console.log("🎉 Decoding complete!");
} catch (err) {
  console.error("❌ Error decoding:", err.message);
}
