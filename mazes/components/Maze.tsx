import { KeyboardEvent, useEffect, useState } from 'react'
import styles from '../styles/components/Maze.module.scss'

export interface MazeProps {
    seed: string,
    size: number
}

export interface MazeCellProps extends Cell {
    index: number,
    player: boolean
}

const Directions = ["top", "right", "bottom", "left"];
const DirectionsMovement = [[0, -1], [1, 0], [0, 1], [-1, 0]];

interface Cell {
    DFSVisited: boolean,
    walls: {
        [index: string]: boolean,
        left: boolean,
        right: boolean,
        top: boolean,
        bottom: boolean
    },
    markerCount: {
        [index: string]: number,
        left: number,
        right: number,
        top: number,
        bottom: number,
        middle: number
    },
    start: boolean,
    finish: boolean
}

interface MazeInterface {
    cells: Cell[];
    seed: string;
    size: number;
}

class MazeObject {
    cells: Cell[];
    seed: string;
    size: number;

    constructor(size: number, seed: string) {
        console.log("Maze constructor");
        this.size = size;
        this.seed = seed;
        
        this.cells = this.emptyMaze();
        console.log(this.cells);
        const startIndex = 94;//size*size-1-this.randomFromInterval(0, size-1);
        const finishIndex = 6;//this.randomFromInterval(0, size-1);

        this.cells[startIndex].start = true;
        this.cells[finishIndex].finish = true;

        this.generateNewMaze(startIndex, finishIndex);
    }

    randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    emptyMaze() {
        let maze: Array<Cell> = [];

        for (let i = 0; i < this.size*this.size; i++) {            
            maze.push({
                DFSVisited: false,
                walls: {
                    left: true,
                    right: true,
                    top: true,
                    bottom: true
                },
                markerCount: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    middle: 0
                },
                start: false,
                finish: false
            })
        }

        return maze;
    }

    generateNewMaze(start: number, finish: number) {
        console.log("Generating new maze...");        
        const getAndVisitNeighbors = (index: number) => {
            let neigbors = [];
            const indexY = Math.floor(index / this.size);
            const indexX = index % this.size;

            for (let i = 0; i < DirectionsMovement.length; i++) { 
                if (indexY + DirectionsMovement[i][1] >= 0 && indexY + DirectionsMovement[i][1] < this.size && indexX + DirectionsMovement[i][0] >= 0 && indexX + DirectionsMovement[i][0] < this.size) {
                    const neigborIndex = (indexY + DirectionsMovement[i][1]) * this.size + indexX + DirectionsMovement[i][0]
                    if (!this.cells[neigborIndex].DFSVisited) {
                        //Remove walls while visiting
                        this.cells[index].walls[Directions[i]] = false;
                        this.cells[neigborIndex].walls[Directions[(i + Directions.length/2) % Directions.length]] = false;
                        neigbors.push(neigborIndex);
                    }    
                }
            }

            return neigbors;
        }

        let stack = [start];
        this.cells[start].DFSVisited = true;

        while (stack.length > 0) {
            let index = this.randomFromInterval(0, stack.length);            
            let currentCellIndex = stack[index];
            stack.splice(index, 1);

            let neighbors = getAndVisitNeighbors(currentCellIndex);
            
            for (let i = 0; i < neighbors.length; i++) {
                this.cells[neighbors[i]].DFSVisited = true;
                stack.push(neighbors[i]);
            }          
        }
            
    }
}

export const MazeCell: React.FC<MazeCellProps> = (props: MazeCellProps) => {    
    const { walls, markerCount, player } = props;

    type Side = {
        style: string
    }
    const sides = {
        top: {
            style: styles.topWall
        },
        bottom: {
            style: styles.bottomWall
        },
        left: {
            style: styles.leftWall
        },
        right: {
            style: styles.rightWall
        }
    }

    const renderWalls = () => {
        let returnValue = [];

        for (const key in sides) {
            returnValue.push(
                <div className={ sides[key].style + (walls[key] ? (" " + styles.wallsActive) : "")}>
                    <div className={ styles.markerCount }>
                        { markerCount.top }
                    </div>
                </div>
            )
        }

        return returnValue;
    }

    return (
        <div className={ styles.cell + (player ? " " + styles.player : "")}>
            <div className={ styles.topWall + (walls.top ? (" " + styles.wallsActive) : "")}>
                <div className={ styles.markerCount }>
                    { markerCount.top }
                </div>
            </div>
            <div className={ styles.bottomWall + (walls.bottom ? (" " + styles.wallsActive) : "")}>
                <div className={ styles.markerCount }>
                    { markerCount.bottom }
                </div>
            </div>
            <div className={ styles.leftWall + (walls.left ? (" " + styles.wallsActive) : "")}>
                <div className={ styles.markerCount }>
                    { markerCount.left }
                </div>
            </div>
            <div className={ styles.rightWall + (walls.right ? (" " + styles.wallsActive) : "")}>
                <div className={ styles.markerCount }>
                    { markerCount.right }
                </div>
            </div>

            <div className={ styles.middleMarkerCount }>
                { markerCount.middle }
            </div>
        </div>
    )
}

export const Maze: React.FC<MazeProps> = (props: MazeProps) => {
    const { seed, size } = props;

    const [maze, setMaze] = useState<MazeInterface>();
    const [playerPosition, setPlayerPosition] = useState({x: 0, y: 0});
    const [counterChange, setCounterChange] = useState(1);

    const keyDownHandler = (event: any) => {      
        if (maze == null) {
            console.log("Cant move in undefined maze");
            return;
        }        

        console.log(event);
        switch (event.key) {
            case "ArrowUp":
                if (!maze.cells[playerPosition.y*maze.size+playerPosition.x].walls.top) {
                    setPlayerPosition({x: playerPosition.x, y: playerPosition.y-1})
                }
                break;

            case "ArrowDown":
                if (!maze.cells[playerPosition.y*maze.size+playerPosition.x].walls.bottom) {
                    setPlayerPosition({x: playerPosition.x, y: playerPosition.y+1})
                }
                break;

            case "ArrowLeft":
                if (!maze.cells[playerPosition.y*maze.size+playerPosition.x].walls.left) {
                    setPlayerPosition({x: playerPosition.x-1, y: playerPosition.y})
                }
                break;

            case "ArrowRight":
                if (!maze.cells[playerPosition.y*maze.size+playerPosition.x].walls.right) {
                    setPlayerPosition({x: playerPosition.x+1, y: playerPosition.y})
                }
                break;
            case "e":
                setCounterChange(-1*counterChange);                
                break;
            case "w":
                changeCounter("top", counterChange);                
                break;
            case "s":
                changeCounter("bottom", counterChange);                
                break;
            case "d":
                changeCounter("right", counterChange);                
                break;
            case "a":
                changeCounter("left", counterChange);                
                break;
            case "q":
                changeCounter("middle", counterChange);                
                break;
        }
    }    

    const changeCounter = (position: string, amount: number) => {
        if (maze == null) {
            console.log("Cant update move counter in undefined maze");
            return;
        }      

        const index = playerPosition.y*maze.size+playerPosition.x;
        if (maze.cells[index].markerCount[position]+amount < 0 || maze.cells[index].markerCount[position]+amount > 99) {
            return;
        }

        const newMaze = {...maze};
        newMaze.cells[index].markerCount[position] += amount;

        
        setMaze(newMaze);
    }

    const renderMaze = () => {
        if (maze == null) {
            return;
        }

        let returnValue = [];

        const renderMazeRow = (row: number) => {
            let returnValue = [];

            for (let i = 0; i < size; i++) {
                returnValue.push(
                    <MazeCell 
                        index={row*size+i}
                        player={row == playerPosition.y && i == playerPosition.x }
                        key={"cell_"+(row*size+i)} 
                        {...maze.cells[row*size+i]}
                    />
                )
            }
            return returnValue;
        }

        for (let i = 0; i < size; i++) {
            returnValue.push(
                <div className={ styles.cellRow } key={"row_"+i}>
                    { renderMazeRow(i) }
                </div>
            )
        }

        return returnValue;
    }

    useEffect(() => {          
        setMaze(new MazeObject(size, seed));
    }, [])

    useEffect(() => {          
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);      
        };
    }, [keyDownHandler])

    useEffect(() => {
        console.log("Player updated");
    }, [playerPosition])

    return (
        <div className={ styles.maze }>
            { renderMaze() }            
        </div>
    )
}

export default Maze;