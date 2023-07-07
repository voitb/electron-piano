// Komponent Pianina
import React, { useState, useEffect } from "react";
import Oscillator from "./Oscillator";
import AudioPlayer from "./AudioPlayer";
import PianoCanvas from "./PianoCanvas";

// todo na niedzielę, albo nawet sobotę wieczór. Yeetnij pianino skąś
// dostosuj do tego co masz zrobione. Lecimy już z real live appką
// jak coś będziesz potrzebował dalej to sobie będziesz na tym playgroudzie
// sprawdzać https://codingnepalweb.com/demos/playable-piano-javascript/ raczej

const Piano = () => {
	const [activeNotes, setActiveNotes] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	useEffect(() => {
		const handleMIDIMessage = ({ data }) => {
			const [command, note, velocity] = data;
			console.log(data);
			switch (command) {
				case 144: // noteOn
					if (velocity > 0) {
						// Only play sound for non-zero velocities
						setActiveNotes((prev) => [...prev, { note, velocity }]);
					}
					break;
				case 128: // noteOff
					setActiveNotes((prev) => prev.filter((n) => n.note !== note));
					break;
			}
		};

		navigator.requestMIDIAccess().then((access) => {
			for (let input of access.inputs.values()) {
				input.onmidimessage = handleMIDIMessage;
			}
		});

		window.electronAPI.ipcRenderer.send("generate");
		window.electronAPI.ipcRenderer.send("generateMP3");
	}, []);
	useEffect(() => {
		// Listen for the event
		window.electronAPI.ipcRenderer.on("hehe", (event, arg) => {
			// setData(arg);
			console.log(event, arg);
		});
		window.electronAPI.ipcRenderer.on("heheMP3", (event, arg) => {
			// setData(arg);
			console.log(event, arg);
		});

		window.electronAPI.openFile();
		window.electronAPI.mp3File();

		// window.electron.ipcRenderer.on('generate', (event, arg) => {
		//   // setData(arg);
		//   console.log(arg);
		// });
	}, []);

	const noteRange = Array.from({ length: 25 }, (_, i) => 60 + i); // MIDI note numbers from C4 (60) to C6 (84)

	const handleMouseDown = (midiId) => {
		setActiveNotes((prev) => [...prev, { note: midiId, velocity: 127 }]);
	};

	const handleMouseUp = (midiId) => {
		setActiveNotes((prev) => prev.filter((n) => n.note !== midiId));
	};

	const whiteNotes = [0, 2, 4, 5, 7, 9, 11]; // MIDI note numbers for white keys (C, D, E, F, G, A, B)
	const whiteKeyWidth = (windowWidth * 0.8) / noteRange.length;
	const blackKeyWidth = whiteKeyWidth * 0.6; // Black keys are 60% the width of white keys

	let keyX = 0;

	const noteNames = [
		"C",
		"C#",
		"D",
		"D#",
		"E",
		"F",
		"F#",
		"G",
		"G#",
		"A",
		"A#",
		"B",
	];

	return (
		<div
			style={{
				position: "relative",
				width: "80vw", // Pianino zajmuje teraz 80% szerokości okna
				height: "120px",
				margin: "0 auto", // Wycentrowanie pianina
			}}
		>
			{noteRange.map((midiId, idx) => {
				const isWhiteKey = whiteNotes.includes(midiId % 12);
				const noteName = noteNames[midiId % 12] + Math.floor(midiId / 12);
				const key = (
					<AudioPlayer
						index={idx}
						key={midiId}
						note={midiId}
						isActive={activeNotes.find((n) => n.note === midiId)}
						midiId={midiId}
						type={isWhiteKey ? "white" : "black"}
						handleMouseDown={handleMouseDown}
						handleMouseUp={handleMouseUp}
						velocity={activeNotes.find((n) => n.note === midiId)?.velocity || 0}
						left={keyX - (isWhiteKey ? 0 : blackKeyWidth / 2)}
						noteName={noteName}
					/>
				);

				// Increase keyX only for white keys
				if (isWhiteKey) keyX += whiteKeyWidth;

				return key;
			})}
		</div>
	);
};
export default Piano;
