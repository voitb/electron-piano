// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

console.log("aha XD");

contextBridge.exposeInMainWorld("electronAPI", {
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	ipcRenderer,
	receive: (channel, func) => {
		let validChannels = ["app_ready"];
		if (validChannels.includes(channel)) {
			// Deliberately strip event as it includes `sender`
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},
});
