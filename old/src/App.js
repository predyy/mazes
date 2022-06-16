import { useEffect, useState } from "react";
import { GenerateMaze, PrintMaze } from "./common/Maze";

import "./style/Style.css";

function App() {
	const [maze, setMaze] = useState([])
	
	useEffect(() => {
		const generatedMaze = GenerateMaze(20);
		setMaze(generatedMaze);
	}, [])

	return (
		
		<div className="App">
			<div className="maze-wrapper">
				{PrintMaze(maze)}
			</div>

			
		</div>
	);
}

export default App;
