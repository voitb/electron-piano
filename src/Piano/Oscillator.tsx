import React, { useEffect, useRef } from "react";
import "./style.css";

const Oscillator = ({
	note,
	isActive,
	midiId,
	type,
	handleMouseDown,
	handleMouseUp,
	velocity,
}) => {
	const oscillator = useRef(null);
	const gainNode = useRef(null);
	const audioContext = useRef(null);

	useEffect(() => {
		audioContext.current = new (window.AudioContext ||
			window.webkitAudioContext)();
	}, []);

	useEffect(() => {
		if (isActive) {
			oscillator.current = audioContext.current.createOscillator();
			gainNode.current = audioContext.current.createGain();
			oscillator.current.type = "sine";
			oscillator.current.frequency.value =
				Math.pow(2, (midiId - 69) / 12) * 440;
			gainNode.current.gain.value = velocity / 127; // map MIDI velocity to [0, 1] range
			oscillator.current.connect(gainNode.current);
			gainNode.current.connect(audioContext.current.destination);
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
export default Oscillator;
