export default class Food {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.x = 0;
        this.y = 0;
    }

    spawn(snakeBody) {
        let valid = false;
        while (!valid) {
            this.x = Math.floor(Math.random() * this.gridSize);
            this.y = Math.floor(Math.random() * this.gridSize);

            valid = true;
            // Check if on snake
            for (const segment of snakeBody) {
                if (this.x === segment.x && this.y === segment.y) {
                    valid = false;
                    break;
                }
            }
        }
    }
}
