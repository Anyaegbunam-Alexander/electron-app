/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/

// backgroundTask.js
const Operation = require("./server/operations").Operation;

async function test() {
	// const operation = await Operation.create();
	// await operation.makeGetRequest();
	// console.log("Success!")
}

console.log("Background task started");
// setInterval(async () => {
// 	await test();
// }, 6000); // Time is in milliseconds 10 minutes
test()