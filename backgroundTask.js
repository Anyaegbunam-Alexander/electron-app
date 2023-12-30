const dbService = require("./server/dbService");
const Operation = require("./server/operations").Operation;

// backgroundTask.js
console.log("Background task started");
setInterval(() => {
	// Your task goes here
	// new Operation({}).parseOutgoingData();
}, 6000); // Time is in milliseconds 10 minutes
