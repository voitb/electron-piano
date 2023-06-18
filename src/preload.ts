// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import * as fs from "fs";
import * as path from "path";

console.log("aha XD");

contextBridge.exposeInMainWorld("electron", {
	fs: {
		readFile: fs.readFile,
		// dodaj inne metody, które chcesz udostępnić
	},
	path: path,
	appPath: path.resolve(__dirname),
	cwd: process.cwd,
	appDir: __dirname,
});
