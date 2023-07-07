import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Key = styled.div`
	height: ${(props) => (props.isWhiteKey ? "120px" : "80px")};
	width: ${(props) => (props.isWhiteKey ? "23px" : "14px")};
	background-color: ${(props) =>
		props.isActive ? "yellow" : props.isWhiteKey ? "white" : "black"};
	position: absolute;
	left: ${(props) => props.left}px;
	bottom: ${(props) => (props.isWhiteKey ? "0" : "40px")};
	border: 1px solid #777;
	z-index: ${(props) => (props.isWhiteKey ? "1" : "2")};
	opacity: ${(props) => (props.isActive ? props.velocity / 127 + 0.2 : 1)};
	display: flex;
	justify-content: center;
	align-items: flex-end;
`;

const NoteName = styled.div`
	font-size: 0.8em;
	margin-bottom: 5px;
`;

const AudioPlayer = ({
	note,
	isActive,
	midiId,
	type,
	handleMouseDown,
	handleMouseUp,
	velocity,
	index,
	left,
	noteName,
}) => {
	const audioBuffer = useRef();
	const audioContext = useRef();
	const audioSource = useRef();
	const [audioData, setAudioData] = useState();
	const [loading, setLoading] = useState(true);
	const rectWidth = 23;
	const rectHeight = 120;

	useEffect(() => {
		audioContext.current = new (window.AudioContext ||
			window.webkitAudioContext)();

		window.electronAPI.ipcRenderer.on("heheMP3", (event, arg) => {
			setAudioData(new Uint8Array(event));
			console.log({ event, arg });
		});
	}, []);

	useEffect(() => {
		if (!audioData) return;
		audioContext.current
			.decodeAudioData(audioData.buffer)
			.then((decodedAudio) => {
				audioBuffer.current = decodedAudio;
				setLoading(false);
			});
	}, [audioData]);

	useEffect(() => {
		const mouseUpListener = () => handleMouseUp(midiId);

		document.addEventListener("mouseup", mouseUpListener);

		return () => {
			document.removeEventListener("mouseup", mouseUpListener);
		};
	}, [midiId]);

	useEffect(() => {
		if (isActive && !loading) {
			audioSource.current = audioContext.current.createBufferSource();
			audioSource.current.buffer = audioBuffer.current;
			audioSource.current.playbackRate.value = Math.pow(2, (midiId - 60) / 12); // change the pitch based on the midiId
			audioSource.current.connect(audioContext.current.destination);
			audioSource.current.start(
				0,
				0,
				audioBuffer.current.duration / audioSource.current.playbackRate.value
			);
		} else {
			if (audioSource.current) {
				audioSource.current.stop();
				audioSource.current = null;
			}
		}
	}, [isActive, loading, midiId]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const whiteKeyWidth = 23;
	const blackKeyWidth = whiteKeyWidth * 0.6; // Czarne klawisze są o 60% węższe od białych
	const whiteKeyHeight = 120;
	const blackKeyHeight = whiteKeyHeight * 0.6; // Czarne klawisze są o 60% niższe od białych

	const isWhiteKey = type === "white";
	const keyWidth = isWhiteKey ? whiteKeyWidth : blackKeyWidth;
	const keyHeight = isWhiteKey ? whiteKeyHeight : blackKeyHeight;

	// Dostosuj pozycję X dla czarnych klawiszy
	const keyOffset = index * whiteKeyWidth;
	const keyX = isWhiteKey ? keyOffset : keyOffset - blackKeyWidth / 2;

	return (
		<Key
			onMouseDown={() => handleMouseDown(midiId)}
			onMouseUp={() => handleMouseUp(midiId)}
			isActive={isActive}
			isWhiteKey={isWhiteKey}
			velocity={velocity}
			left={left}
		>
			{isWhiteKey && <NoteName>{noteName}</NoteName>}
		</Key>
	);
};
export default AudioPlayer;
