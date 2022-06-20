import { KeyboardEvent, useEffect, useState } from 'react'
import { MazeObject, Cell, randomFromInterval } from '../lib/Maze'
import styles from '../styles/components/Maze.module.scss'

export interface MazeProps {
    seed: string,
    size: number
}

export interface MazeCellProps extends Cell {
    index: number,
    player: boolean
}

interface MazeInterface {
    cells: Cell[];
    seed: string;
    size: number;
}

export const MazeCell: React.FC<MazeCellProps> = (props: MazeCellProps) => {    
    const { walls, markerCount, index, player, finish } = props;
    
    interface Side {
        style: string
    }
    const sides = new Map<string, Side>([
        ["top", { style: styles.topWall }],
        ["left", { style: styles.leftWall }],
        ["right", { style: styles.rightWall }],
        ["bottom", { style: styles.bottomWall }]
    ]);

    const renderWalls = () => {
        let returnValue = [];

        for (let [key, value] of sides) {
            returnValue.push(
                <div 
                    key={ "wall_"+key } 
                    className={ value.style + (walls[key] ? (" " + styles.wallsActive) : "") }
                >
                    <div className={ styles.markerCount }>
                        { markerCount[key] > 0 ? markerCount[key] : "" }
                    </div>
                </div>
            );
        }

        return returnValue;
    }

    return (
        <div className={ styles.cell + (finish ? (" " + styles.finish) : "")}>
            { player ? <div className={ styles.player }></div> : ""}
            { renderWalls() }

            <div className={ styles.middleMarkerCount }>
                { markerCount.middle > 0 ? markerCount.middle : "" }
            </div>
        </div>
    )
}

export const Maze: React.FC<MazeProps> = (props: MazeProps) => {
    const { seed, size } = props;

    const [maze, setMaze] = useState<MazeInterface>();
    const [playerPosition, setPlayerPosition] = useState({
        x: randomFromInterval(0, size-1, seed),
        y: randomFromInterval(0, size-1, seed),
    });
    const [counterChange, setCounterChange] = useState(1);

    const keyDownHandler = (event: any) => {      
        if (maze == null) {
            console.log("Cant move in undefined maze");
            return;
        }        

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
        function getRandomCoordinatesTouchingWall() {
            let postions = [
                randomFromInterval(0, (size - 1), seed),
                [0, size-1][randomFromInterval(0, 1, seed)]
            ]
            
            let x = postions.splice(randomFromInterval(0, postions.length-1, seed), 1)[0];
            let y = postions.splice(randomFromInterval(0, postions.length-1, seed), 1)[0];
            
            
            console.log(x, y);
            return y*size + x;
        }

        setMaze(new MazeObject(
            size, 
            seed, 
            false,             
            (playerPosition.y*size + playerPosition.x), 
            getRandomCoordinatesTouchingWall()
        ));
    }, [])

    useEffect(() => {          
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);      
        };
    }, [keyDownHandler])

    return (
        <div className={ styles.maze }>
            { renderMaze() }            
        </div>
    )
}

export default Maze;