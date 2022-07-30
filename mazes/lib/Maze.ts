export const Directions = ["top", "right", "bottom", "left"];
export const DirectionsMovement = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export function randomFromInterval(min: number, max: number, seed: string) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface Cell {
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

export class MazeObject {
    cells: Cell[];
    seed: string;
    size: number;
    startIndex: number;
    finishIndex: number;

    constructor(size: number, seed: string, cycles: boolean, startIndex: number, finishIndex: number) {
        this.size = size;
        this.seed = seed;
        
        this.cells = this.emptyMaze();

        this.startIndex = startIndex; //size*size-1-randomFromInterval(0, size-1, this.seed);
        this.finishIndex = finishIndex; //randomFromInterval(0, size-1, this.seed);

        this.cells[this.startIndex].start = true;
        this.cells[this.finishIndex].finish = true;        

        this.generateNewMaze(startIndex, finishIndex);
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
            let index = randomFromInterval(0, stack.length, this.seed);            
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