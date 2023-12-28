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
	var about = `Lorem ${name}`;
	const db = dbService.getDbServiceInstance();
    db.insertNewName(name, about);
    console.log(`${name} inserted`)
}, 20000); // Time is in milliseconds 20 secs
