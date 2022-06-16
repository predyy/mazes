export interface MazeProps {
    seed: string,
    size: number
}

export const Maze: React.FC<MazeProps> = (props: MazeProps) => {
    const { seed, size } = props;

    return (
        <div>
            { seed }
            { size }
            Maze
        </div>
    )
}

export default Maze;