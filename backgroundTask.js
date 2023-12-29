const dbService = require("./server/dbService");

const names = [
	"Kay",
	"Schaden",
	"Deonte",
	"Parisian",
	"Sarai",
	"Isobel",
	"Grant7",
	"Priscilla",
	"Rolfson",
	"Kelsie",
	"Belle",
	"Heidenreich",
];
// backgroundTask.js
console.log("Background task started");
setInterval(() => {
	// Your task goes here
	var randInt = Math.floor(Math.random() * 8);
	var name = names[randInt];
    console.log(`${name} inserted`)
}, 600000); // Time is in milliseconds 10 minutes
