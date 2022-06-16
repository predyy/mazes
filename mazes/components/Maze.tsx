import { KeyboardEvent, useEffect, useState } from 'react'
import styles from '../styles/components/Maze.module.scss'

export interface MazeProps {
    seed: string,
    size: number
}

interface MarkerCount {
    left: number,
    right: number,
    top: number,
    bottom: number,
    middle: number
}

interface Cell {
    walls: {
        left: boolean,
        right: boolean,
        top: boolean,
        bottom: boolean
    },
    markerCount: {
        left: number,
        right: number,
        top: number,
        bottom: number,
        middle: number
    }
}

class MazeObject {
    cells: Cell[];
    seed: string;

    constructor(size: number, seed: string) {
         this.cells = Array(size*size).fill({
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
            }
        });

        this.seed = seed;
    }

    randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateNewMaze() {

    }
}

export const MazeCell: React.FC<Cell> = (props: Cell) => {    
    const { walls, markerCount } = props;

    return (
        <div className={ styles.cell }>
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
    const [maze, setMaze] = useState<MazeObject>(new MazeObject(size));
    const [playerPosition, setPlayerPosition] = useState({x: 0, y: 0});

    const keyDownHandler = (event: Event) => {
        console.log(event);
    }    

    const renderMaze = () => {
        let returnValue = [];

        const renderMazeRow = (row: number) => {
            let returnValue = [];

            for (let i = 0; i < size; i++) {
                returnValue.push(
                    <MazeCell 
                        key={"cell_"+row*size+i} 
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
        window.addEventListener('keydown', keyDownHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);      
        };
    }, [])

    return (
        <div className={ styles.maze }>
            { renderMaze() }            
        </div>
    )
}

export default Maze;