// Komponent Klawisza
import React, { useEffect, useRef } from "react";
import "./style.css";

const Oscillator = ({
	note,
	isActive,
	midiId,
	type,
	handleMouseDown,
	handleMouseUp,
}) => {
	const oscillator = useRef(null);
	const audioContext = useRef(null);

	useEffect(() => {
		audioContext.current = new (window.AudioContext ||
			window.webkitAudioContext)();
	}, []);

	useEffect(() => {
		if (isActive) {
			oscillator.current = audioContext.current.createOscillator();
			oscillator.current.type = "sine";
			oscillator.current.frequency.value =
				Math.pow(2, (midiId - 69) / 12) * 440; // formula to convert MIDI note to frequency
			oscillator.current.connect(audioContext.current.destination);
			oscillator.current.start();
		} else {
			if (oscillator.current) {
				oscillator.current.stop();
				oscillator.current.disconnect();
			}
		}

		return () => {
			if (oscillator.current) {
				oscillator.current.stop();
				oscillator.current.disconnect();
			}
		};
	}, [isActive]);

	return (
		<div
			className={`piano-key ${type} ${isActive ? "active" : ""}`}
			onMouseDown={() => handleMouseDown(midiId)}
			onMouseUp={() => handleMouseUp(midiId)}
		>
			{note}
		</div>
	);
};

// Komponent Pianina
import React, { useState, useEffect } from "react";

const Piano = () => {
	const [activeNotes, setActiveNotes] = useState([]);

	useEffect(() => {
		const handleMIDIMessage = ({ data }) => {
			const [command, note, velocity] = data;
			console.log(data);
			switch (command) {
				case 144: // noteOn
					if (velocity > 0) {
						// Only play sound for non-zero velocities
						setActiveNotes((prev) => [...prev, note]);
					}
					break;
				case 128: // noteOff
					setActiveNotes((prev) => prev.filter((n) => n !== note));
					break;
			}
		};

		navigator.requestMIDIAccess().then((access) => {
			for (let input of access.inputs.values()) {
				input.onmidimessage = handleMIDIMessage;
			}
		});
	}, []);

	const noteRange = Array.from({ length: 25 }, (_, i) => 60 + i); // MIDI note numbers from C4 (60) to C6 (84)
	const whiteNotes = [0, 2, 4, 5, 7, 9, 11]; // MIDI note numbers for white keys (C, D, E, F, G, A, B)

	const handleMouseDown = (midiId) => {
		setActiveNotes((prev) => [...prev, midiId]);
	};

	const handleMouseUp = (midiId) => {
		setActiveNotes((prev) => prev.filter((n) => n !== midiId));
	};

	return (
		<div>
			{noteRange.map((midiId) => (
				<Oscillator
					key={midiId}
					note={midiId}
					isActive={activeNotes.includes(midiId)}
					midiId={midiId}
					type={whiteNotes.includes(midiId % 12) ? "white" : "black"}
					handleMouseDown={handleMouseDown}
					handleMouseUp={handleMouseUp}
				/>
			))}
		</div>
	);
};

export default Piano;
