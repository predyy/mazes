const directions = ["top", "right", "bottom", "left"];
const directionsMovement = [[0, -1], [1, 0], [0, 1], [-1, 0]]

export function GenerateMaze(size) {
    function CreateEmptyMaze(size) {
        let maze = new Array(size*size);
    
        for (let i = 0; i < maze.length; i++) {
            maze[i] = {
                walls: [true, true, true, true],
                start: false,
                finish: false,
                DFSVisited: false,                
            }
        }
    
        return maze;
    }

    function RandomFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function DFSGenerate(start, finish, maze) {
        function GetAndVisitNeighbors(index, size) {
            let neigbors = [];
            const indexY = Math.floor(index / size);
            const indexX = index % size;

            for (let i = 0; i < directionsMovement.length; i++) { 
                if (indexY + directionsMovement[i][1] >= 0 && indexY + directionsMovement[i][1] < size && indexX + directionsMovement[i][0] >= 0 && indexX + directionsMovement[i][0] < size) {
                    const neigborIndex = (indexY + directionsMovement[i][1]) * size + indexX + directionsMovement[i][0]
                    if (!maze[neigborIndex].DFSVisited) {
                        //Remove walls while visiting
                        maze[index].walls[i] = false;
                        maze[neigborIndex].walls[(i + directionsMovement.length/2) % directionsMovement.length] = false;
                        neigbors.push(neigborIndex);
                    }
                }
            }
            return neigbors;
        }

        let stack = [start];
        maze[start].DFSVisited = true;
        const size = Math.sqrt(maze.length);

        while (stack.length > 0) {
            let index = RandomFromInterval(0, stack.length);            
            let currentCellIndex = stack[index];
            stack.splice(index, 1);

            let neighbors = GetAndVisitNeighbors(currentCellIndex, size);
            
            for (let i = 0; i < neighbors.length; i++) {
                maze[neighbors[i]].DFSVisited = true;
                stack.push(neighbors[i]);
            }            
        }
    }
    
    let maze = CreateEmptyMaze(size);
    const startIndex = size*size-1-RandomFromInterval(0, size-1);
    const finishIndex = RandomFromInterval(0, size-1);   
    maze[startIndex].start = true;
    maze[finishIndex].finish = true;

    DFSGenerate(startIndex, finishIndex, maze);
    return maze;
}

export function PrintMaze(maze) {
    function PrintCell(cell, key) {
        function Capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    
        let style = {"backgroundColor": "white"};
        const borderStyle = "1px solid black";
        const transparentBorderStyle = "1px solid transparent";
        const finishStyle = "yellow";
        const startStyle = "red";
    
        for (let i = 0; i < cell.walls.length; i++) {
            if (cell.walls[i]) {
                style["border"+Capitalize(directions[i])] = borderStyle;
            } else {
                style["border"+Capitalize(directions[i])] = transparentBorderStyle;
            }
        }
        
        if (cell.start) {        
            style["backgroundColor"] = startStyle;
        }

        if (cell.finish) {
            style["backgroundColor"] = finishStyle;
        }    
       
        return <div className="maze-cell" style={style} key={"cell"+key}>{key}</div>
    }

    let returnValue = [];
    const size = Math.sqrt(maze.length);
    let row = [];      

    for (var i = 0; i < maze.length; i++) {
        if (i % size == 0) {
            returnValue.push(<div className="maze-row" key={"row"+i}>{row}</div>);
            row = [];
        }
        row.push(PrintCell(maze[i], i));
    }
    returnValue.push(<div className="maze-row" key={"row"+i}>{row}</div>);

    return returnValue;
}