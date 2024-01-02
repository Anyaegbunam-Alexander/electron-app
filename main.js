/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/

const { app, BrowserWindow } = require("electron/main");
const { Worker } = require("worker_threads");
const path = require("node:path");
require("./server/app");

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	win.loadURL("http://localhost:3459/home");
}

app.whenReady().then(() => {
	createWindow();

	const worker = new Worker(path.join(__dirname, "backgroundTask.js"));

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
