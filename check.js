const { names } = require("./new.js");

// Split the text into an array of names, handling different line endings and extra spaces
const nameArray = names.split(/\r?\n/).filter((name) => name.trim() !== "");

// Clean up each name
const cleanedNames = nameArray.map((name) => {
  return name.replace(/\.+/g, "").trim();
});

// Remove duplicates
const uniqueNames = [...new Set(cleanedNames)];

// Create an object with names as keys
const namesObject = uniqueNames.reduce((acc, name, index) => {
  acc[`name${index + 1}`] = name;
  return acc;
}, {});

// Convert to JSON
const jsonOutput = JSON.stringify(namesObject, null, 2);

console.log(jsonOutput);
console.log(`\nTotal unique names: ${uniqueNames.length}`);

// Extract client names
const clientNames = nameArray.map((name) => {
  const parts = name.split(" ");
  return parts.slice(0, 2).join(" ");
});

// Remove duplicates
const uniqueClientNames = [...new Set(clientNames)];

// Create an object with client names as keys
const clientNamesObject = uniqueClientNames.reduce((acc, name, index) => {
  acc[`client${index + 1}`] = name;
  return acc;
}, {});

// Convert to JSON
const clientJsonOutput = JSON.stringify(clientNamesObject, null, 2);

console.log(clientJsonOutput);
console.log(`\nTotal unique client names: ${uniqueClientNames.length}`);
