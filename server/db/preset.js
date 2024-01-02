/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/

const fs = require("fs");
const path = require("path");
// Function to change the file extension
function changeFileExtension(fileName, newExtension) {
	fileName = path.resolve(__dirname, fileName);
	let baseName = fileName.split(".").slice(0, -1).join("."); // get the filename without extension
	let newFileName = baseName + newExtension; // create new file name
	fs.renameSync(fileName, newFileName, function (err) {
		if (err) console.log("ERROR: " + err);
	});
}

module.exports.changeFileExtension = changeFileExtension;
