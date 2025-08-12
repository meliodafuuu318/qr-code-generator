/**
 * base64-builder.js
 * 
 * Converts text and images to Base64 and combines them into a single string.
 * Run with: node base64-builder.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Convert plain text to Base64
 * @param {string} text 
 * @returns {string}
 */
function textToBase64(text) {
  return Buffer.from(text, 'utf-8').toString('base64');
}

/**
 * Convert image file to Base64 Data URI
 * @param {string} imagePath 
 * @returns {string}
 */
function imageToBase64(imagePath) {
  const ext = path.extname(imagePath).slice(1); // e.g., "png", "jpg"
  const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const imgBuffer = fs.readFileSync(imagePath);
  return `data:${mimeType};base64,${imgBuffer.toString('base64')}`;
}

/**
 * Combine text and images into a JSON object, then Base64 encode
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

// ====== Example usage ======

// Text you want to embed
const myText = "Hello! This QR code contains both text and images.";

// Paths to your images (must be in same folder or provide full path)
const myImages = [
  './example1.png',
  './example2.jpg'
];

// Generate the Base64
const base64Result = combineTextAndImagesToBase64(myText, myImages);

// Output to console or save to file
console.log("Combined Base64:\n", base64Result);

// Optionally save to a file
fs.writeFileSync('output_base64.txt', base64Result);

