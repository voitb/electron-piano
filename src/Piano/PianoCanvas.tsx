import React, { useEffect, useRef, useState } from "react";

const whiteKeys = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
const blackKeys = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];
const keyWidth = 23;
const blackKeyWidth = keyWidth / 2;
const keyHeight = 120;
const blackKeyHeight = keyHeight * 0.65;

const frequencyFromKey = (key) => {
	return 440 * Math.pow(2, (key - 49) / 12);
};

const PianoSvg = () => {
	const audioContextRef = useRef();
	const oscillatorRef = useRef();
	const [activeKey, setActiveKey] = useState(null);

	useEffect(() => {
		audioContextRef.current = new (window.AudioContext ||
			window.webkitAudioContext)();
	}, []);

	const playNote = (key) => {
		const frequency = frequencyFromKey(key);
		const oscillator = audioContextRef.current.createOscillator();
		oscillator.type = "sine";
		oscillator.frequency.value = frequency;
		oscillator.connect(audioContextRef.current.destination);
		oscillator.start();
		oscillatorRef.current = oscillator;
	};

	const stopNote = () => {
		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
			oscillatorRef.current = null;
		}
	};

	const handleMouseDown = (key) => {
		setActiveKey(key);
		playNote(key);
	};

	const handleMouseUp = () => {
		setActiveKey(null);
		stopNote();
	};

	return (
		<div
			onMouseUp={handleMouseUp}
			width={whiteKeys.length * keyWidth}
			height={keyHeight}
		>
			{whiteKeys.map((note, index) => (
				<rect
					key={note}
					x={index * keyWidth}
					y="0"
					width={keyWidth}
					height={keyHeight}
					fill={note === activeKey ? "yellow" : "white"}
					stroke="black"
					onMouseDown={() => handleMouseDown(note)}
				/>
			))}
			{blackKeys.map((note, index) => (
				<rect
					key={note}
					x={(index + 1) * keyWidth - blackKeyWidth / 2}
					y="0"
					width={blackKeyWidth}
					height={blackKeyHeight}
					fill={note === activeKey ? "yellow" : "black"}
					onMouseDown={() => handleMouseDown(note)}
				/>
			))}
		</div>
	);
};

export default PianoSvg;
