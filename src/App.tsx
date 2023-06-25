import React, { useEffect } from "react";
import * as midiFileParser from "midi-file-parser";
import midiFilePath from "./assets/mozart.mid";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import * as fs from "fs";
import * as path from "path";
import { parseArrayBuffer } from "midi-json-parser";
import { ipcMain, ipcRenderer } from "electron";

// ...

const App: React.FC = () => {
	useEffect(() => {
		// const filePath = window.electron.path.resolve(
		// 	window.electron.appDir,
		// 	midiFilePath
		// );
		// console.log(window.electron.fs.readdirSync("./"));
		// const midiData = window.electron.fs.readFileSync("./src/assets/mozart.mid");
		// const midi = new Midi(midiData);
		// console.log(midi);
		// console.log(midi.tracks[0].notes);
		// console.log(Tone);
		// const synth = new Tone.Synth().toDestination();
		// Tone.start();
		// midi.tracks[0].notes.forEach((note) => {
		// 	synth.triggerAttackRelease(
		// 		note.name,
		// 		note.duration,
		// 		note.time,
		// 		note.velocity
		// 	);
		// });
		// const midiToJson = window.electronAPI.generateMidi();
		// console.log(
		// 	window.electron,
		// 	window.electronAPI,
		// 	midiToJson,
		// 	window.electron.ipcMain
		// );
		// // window.electron.ipcMain.on("dialog:generateMidi", (event, args) => {
		// // 	// Your code to handle the 'dialog:generateMidi' event goes here
		// // 	// After processing, you can reply back to the renderer process like so:
		// // 	console.log(event);
		// // 	event.reply("dialog:generateMidi-response", "Your response goes here");
		// // });
		// window.electron.ipcRenderer.on("dialog:generateMidi", (event, args) => {
		// 	console.log(event, args);
		// });

		window.electronAPI.receive("app_ready", () => {
			// Put the code to invoke 'dialog:openFile' here
			console.log("aha");
		});

		const updateDevices = (event) => {
			console.log(
				`Name ${event.port.name}, brand: ${event.port.manufacturer}, State, ${event.port.state}, Type: ${event.port.type}`
			);
		};

		const noteOn = (note, velocity) => {
			console.log(note, velocity);
		};

		const noteOff = (note) => {
			console.log(note);
		};

		const handleInput = (input) => {
			const [command, note, velocity] = input.data;
			switch (command) {
				case 144: // noteOn
					if (velocity > 0) {
						noteOn(note, velocity);
					} else {
						noteOff(note);
					}
					break;
				case 128: // note off
					noteOff(note);
					break;
			}
		};

		const success = (midiAccess) => {
			console.log(midiAccess);
			// midiAccess.onstatechange = updateDevices;
			midiAccess.addEventListener("statechange", updateDevices);

			const inputs = midiAccess.inputs;
			console.log(inputs);
			inputs.forEach((input) => {
				// console.log(input);
				input.onmidimessage = handleInput;
				input.addEventListener("midimessage", handleInput);
			});
		};
		const failure = () => {
			console.log("Failure");
		};

		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess().then(success, failure);
		}
	}, []);

	return (
		<div
			onClick={async () => {
				const filePath = await window.electronAPI.openFile();
				// filePathElement.innerText = filePath
				console.log(filePath);
			}}
		>
			xd
		</div>
	);
};

export default App;
