// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

contextBridge.exposeInMainWorld("electronAPI", {
	mp3File: () => ipcRenderer.invoke("dialog:mp3File"),
	ipcRenderer: {
		...ipcRenderer,
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
	},
	receive: (channel, func) => {
		let validChannels = ["app_ready"];
		if (validChannels.includes(channel)) {
			// Deliberately strip event as it includes `sender`
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},
	openFile: () => ipcRenderer.send("dialog:openFile"),
	mp3File: () => ipcRenderer.send("dialog:mp3File"),
});
