// utils/idGenerator.js
const crypto = require("crypto");

function generateCustomId(prefix = "") {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(4).toString("hex");
  return `${prefix}${timestamp}${randomPart}`.toUpperCase();
}

module.exports = generateCustomId;
