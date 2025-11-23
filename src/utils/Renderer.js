export default class Renderer {
    constructor(ctx, width, height, gridSize, tileSize) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
        this.tileSize = tileSize;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;

        /*
        // Optional: Draw grid lines
        for (let x = 0; x <= this.width; x += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.height; y += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        */
    }

    drawSnake(snake) {
        this.ctx.fillStyle = '#4caf50'; // Snake color

        snake.body.forEach((segment, index) => {
            // Head is slightly different color or just same
            if (index === 0) {
                this.ctx.fillStyle = '#66bb6a';
            } else {
                this.ctx.fillStyle = '#4caf50';
            }

            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 1, // -1 for gap
                this.tileSize - 1
            );
        });
    }

    drawFood(food) {
        this.ctx.fillStyle = '#f44336'; // Food color
        this.ctx.fillRect(
            food.x * this.tileSize,
            food.y * this.tileSize,
            this.tileSize - 1,
            this.tileSize - 1
        );
    }

    drawMessage(text) {
        // Optional helper for drawing text on canvas if needed, 
        // but we use DOM overlay for main UI.
    }
}
