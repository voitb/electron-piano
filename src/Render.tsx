import * as ReactDOM from "react-dom";
import App from "./App";
import PianoOld from "./Piano";
import Piano from "./Piano/Piano";

function render() {
	// ReactDOM.render(<App />, document.body);
	// ReactDOM.render(<PianoOld />, document.body);
	ReactDOM.render(<Piano />, document.body);
}

render();
