import React, { useEffect } from "react";
import * as midiFileParser from "midi-file-parser";
import midiFilePath from "./assets/mozart.mid";

import * as fs from "fs";
import * as path from "path";

// ...

const App: React.FC = () => {
	useEffect(() => {
		const filePath = window.electron.path.resolve(
			window.electron.appDir,
			midiFilePath
		);

		window.electron.fs.readFile(filePath, "utf-8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			const midiJson = midiFileParser(data);

			console.log(midiJson);

			// Teraz midiJson zawiera dane MIDI w formacie JSON
			// Następnie możesz użyć tych danych do odtworzenia muzyki za pomocą Tone.js
			// ...
		});
	}, []);

	return <div>{/* Wyświetl listę plików MIDI tutaj */}</div>;
};

export default App;
