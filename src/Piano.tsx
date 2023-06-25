import React, { useEffect, useRef, useState } from "react";
import { Synth } from "tone";
import "./style.css";

// ...

// funkcja zmieniająca nr klawisza z midi na nutę.

// Ta funkcja działa poprzez obliczenie oktawy i klucza dla danej wartości MIDI.
// Określa oktawę, dzieląc wartość MIDI przez 12 i odejmując 1. Następnie określa klucz,
// obliczając resztę z dzielenia wartości MIDI przez 12 i korzystając z tej reszty do
// indeksowania tablicy notes.

//  Pamiętaj, że w zależności od konkretnego systemu, który używasz, możesz potrzebować
//  innej konwersji dla oktawy. Niektóre systemy mogą na przykład traktować C4 jako MIDI 60,
//  podczas gdy inne mogą traktować C5 jako MIDI 60.
const notes = [
	"C4",
	"C#4",
	"D4",
	"D#4",
	"E4",
	"F4",
	"F#4",
	"G4",
	"G#4",
	"A4",
	"A#4",
	"B4",
	"C5",
	"C#5",
	"D5",
	"D#5",
	"E5",
	"F5",
	"F#5",
	"G5",
	"G#5",
	"A5",
	"A#5",
	"B5",
	"C6",
];

function midiToNote(midiValue) {
	const notes = [
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

	const octave = Math.floor(midiValue / 12); // Octave is calculated by dividing by 12
	const key = notes[midiValue % 12]; // Key is calculated by modulo operation with 12 to get the remainder

	return key + octave;
}

const App: React.FC = () => {
	const synth = useRef(new Synth().toDestination());
	const [chords, setChords] = useState([]);
	const [activeKeys, setActiveKeys] = useState([]);

	const [activeNote, setActiveNote] = useState(null); // dodaj stan dla aktywnego klawisza

	useEffect(() => {
		window.electronAPI.receive("app_ready", () => {
			console.log("aha");
		});

		const updateDevices = (event) => {
			console.log(
				`Name ${event.port.name}, brand: ${event.port.manufacturer}, State, ${event.port.state}, Type: ${event.port.type}`
			);
		};

		const noteOn = (note, velocity) => {
			const synth = new Synth().toDestination();
			let noteString = midiToNote(note);
			console.log(note, velocity, noteString);
			if (noteString) {
				let duration = "8n";
				if (velocity < 64) {
					duration = "16n";
				} else if (velocity < 128) {
					duration = "8n";
				}
				let midiVelocity = 64; // Example MIDI velocity
				let toneVelocity = midiVelocity / 127; // Normalize to 0-1 range

				synth.triggerAttackRelease(
					noteString,
					duration,
					undefined,
					toneVelocity
				);
				// Dodanie tego klawisza do listy aktywnych klawiszy
				setActiveKeys((prevKeys) => [...prevKeys, noteString]);
			} else {
				synth.dispose();
				console.log(`No note mapping for MIDI number: ${note}`);
			}
		};

		// Zmiana funkcji noteOff
		const noteOff = (note) => {
			console.log(note);
			let noteString = midiToNote(note);

			// Usunięcie tego klawisza z listy aktywnych klawiszy
			setActiveKeys((prevKeys) => prevKeys.filter((key) => key !== noteString));

			console.log(`No note mapping for MIDI number: ${note}`);
		};

		const handleInput = (input) => {
			console.log(input, "input");
			const [command, note, velocity] = input.data;
			switch (command) {
				case 144: // noteOn
					if (velocity > 0) {
						// Only play sound for non-zero velocities
						noteOn(note, velocity);
					}
					break;
				case 128: // noteOff
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
	const playNote = (note) => {
		setActiveKeys((prevKeys) => [...prevKeys, note]);

		setActiveNote(note); // ustaw aktywną nutę
		synth.current.triggerAttackRelease(note, "8n"); // graj nutę
	};

	const stopNote = () => {
		setActiveKeys((prevKeys) => prevKeys.filter((key) => key !== note));

		setActiveNote(null); // zresetuj aktywną nutę
	};

	return (
		<div>
			<div className="piano">
				{notes.map((note) => (
					<div
						key={note}
						className={`piano-key ${
							note.includes("#") ? "black-key" : "white-key"
						} ${activeKeys.includes(note) ? "active" : ""}`}
						onMouseDown={() => playNote(note)}
						onMouseUp={() => stopNote(note)}
					>
						{note}
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
