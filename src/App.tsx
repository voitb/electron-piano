import React, { useEffect } from "react";
import * as midiFileParser from "midi-file-parser";
import midiFilePath from "./assets/mozart.mid";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import * as fs from "fs";
import * as path from "path";
import { parseArrayBuffer } from "midi-json-parser";

// ...

const App: React.FC = () => {
	useEffect(() => {
		// const filePath = window.electron.path.resolve(
		// 	window.electron.appDir,
		// 	midiFilePath
		// );
		console.log(window.electron.fs.readdirSync("./"));

		const midiData = window.electron.fs.readFileSync("./src/assets/mozart.mid");

		const midi = new Midi(midiData);
		console.log(midi);
		console.log(midi.tracks[0].notes);
		console.log(Tone);
		const synth = new Tone.Synth().toDestination();
		Tone.start();

		midi.tracks[0].notes.forEach((note) => {
			synth.triggerAttackRelease(
				note.name,
				note.duration,
				note.time,
				note.velocity
			);
		});
	}, []);

	return <div>{/* Wyświetl listę plików MIDI tutaj */}</div>;
};

export default App;
