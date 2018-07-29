// This code is a part of MagicCap which is a MPL-2.0 licensed project.
// Copyright (C) Jake Gealer <jake@gealer.email> 2018.
// Copyright (C) Rhys O'Kane <SunburntRock89@gmail.com> 2018.

const configtemplate = {
	hotkey: "",
	novus_token: "",
};

const { stat, writeJSON } = require("fs-nextra");

(async() => {
	let fileExists = await stat(`${require("os").homedir()}/magiccap.json`).catch(async() => {
		writeJSON(`${require("os").homedir()}/magiccap.json`, configtemplate).catch(async() => {
			throw new Error("Could not find or create config file.");
		});
	});
})();

const config = global.config = require(`${require("os").homedir()}/magiccap.json`);
const capture = require("./capture.js");
const { app, Tray, Menu, dialog, Notification } = require("electron");
const sqlite3 = require("sqlite3").verbose();

// Prepares the DB.

async function runCapture() {
	let filename = capture.createCaptureFilename();
	await capture.handleScreenshotting(filename)
		.then(async res => {
			throw new Notification("MagicCap", { body: res });
		})
		.catch(async err => {
			await capture.logUpload(filename, 0, undefined, undefined);
			dialog.showErrorBox("MagicCap", `${err}`);
		});
}
// Runs the capture.

function initialiseScript() {
	const tray = new Tray(`${__dirname}/icons/taskbar.png`);
	const contextMenu = Menu.buildFromTemplate([
		{ label: "Exit", type: "normal", role: "quit" },
	]);
	tray.setContextMenu(contextMenu);
}
// Initialises the script.

app.on("ready", initialiseScript);
// The app is ready to rock!
