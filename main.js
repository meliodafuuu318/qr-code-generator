/**
 * qr-base64-generator.js
 * 
 * Combines text and images into Base64, sends to QuickChart.io QR API via POST,
 * and saves the resulting QR code image locally.
 * 
 * Run: npm install axios
 * Then: node qr-base64-generator.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Convert image file to Base64 Data URI
 * @param {string} imagePath 
 * @returns {string}
 */
function imageToBase64(imagePath) {
  const ext = path.extname(imagePath).slice(1); // png, jpg
  const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const imgBuffer = fs.readFileSync(imagePath);
  return `data:${mimeType};base64,${imgBuffer.toString('base64')}`;
}

/**
 * Combine text + images into Base64 string
 * @param {string} text 
 * @param {string[]} imagePaths 
 * @returns {string}
 */
function combineTextAndImagesToBase64(text, imagePaths) {
  const data = {
    text: text,
    images: imagePaths.map(imageToBase64)
  };
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString, 'utf-8').toString('base64');
}

/**
 * Send Base64 payload to QuickChart QR API via POST
 * @param {string} base64Data 
 */
async function sendToQuickChart(base64Data) {
  try {
    const response = await axios.post(
      'https://quickchart.io/qr',
      {
        text: base64Data,
        size: 300,      // QR code size in px
        margin: 2,      // QR margin
        format: 'png'   // Output format
      },
      { responseType: 'arraybuffer' } // Get binary data
    );

    fs.writeFileSync('qr_code.png', response.data);
    console.log("✅ QR code saved as qr_code.png");
  } catch (err) {
    console.error("❌ Error generating QR code:", err.message);
  }
}

// ===== Example usage =====
(async () => {
  const myText = "Hello! This QR code contains both text and images.";
  const myImages = [
    './example1.png',
    './example2.jpg'
  ];

  const base64Payload = combineTextAndImagesToBase64(myText, myImages);
  await sendToQuickChart(base64Payload);
})();
