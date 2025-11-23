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
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 0.5;

        // Draw subtle grid
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
    }

    drawSnake(snake) {
        snake.body.forEach((segment, index) => {
            const x = segment.x * this.tileSize;
            const y = segment.y * this.tileSize;
            const size = this.tileSize - 2; // Gap between segments

            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#66bb6a';
                this.roundRect(x + 1, y + 1, size, size, 5);
                this.drawEyes(x, y, snake.direction);
            } else {
                // Body
                this.ctx.fillStyle = '#4caf50';
                this.roundRect(x + 1, y + 1, size, size, 4);
            }
        });
    }

    roundRect(x, y, w, h, r) {
        if (this.ctx.roundRect) {
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, w, h, r);
            this.ctx.fill();
        } else {
            this.ctx.fillRect(x, y, w, h);
        }
    }

    drawEyes(x, y, direction) {
        this.ctx.fillStyle = 'white';
        const eyeSize = this.tileSize / 5;
        const offset = this.tileSize / 4;

        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

        // Default Up
        leftEyeX = x + offset;
        leftEyeY = y + offset;
        rightEyeX = x + this.tileSize - offset - eyeSize;
        rightEyeY = y + offset;

        if (direction.x === 1) { // Right
            leftEyeX = x + this.tileSize - offset - eyeSize;
            leftEyeY = y + offset;
            rightEyeX = x + this.tileSize - offset - eyeSize;
            rightEyeY = y + this.tileSize - offset - eyeSize;
        } else if (direction.x === -1) { // Left
            leftEyeX = x + offset;
            leftEyeY = y + offset;
            rightEyeX = x + offset;
            rightEyeY = y + this.tileSize - offset - eyeSize;
        } else if (direction.y === 1) { // Down
            leftEyeX = x + offset;
            leftEyeY = y + this.tileSize - offset - eyeSize;
            rightEyeX = x + this.tileSize - offset - eyeSize;
            rightEyeY = y + this.tileSize - offset - eyeSize;
        }

        this.ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
        this.ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);

        // Pupils
        this.ctx.fillStyle = 'black';
        const pupilSize = eyeSize / 2;
        this.ctx.fillRect(leftEyeX + pupilSize / 2, leftEyeY + pupilSize / 2, pupilSize, pupilSize);
        this.ctx.fillRect(rightEyeX + pupilSize / 2, rightEyeY + pupilSize / 2, pupilSize, pupilSize);
    }

    drawFood(food, timestamp) {
        const x = food.x * this.tileSize;
        const y = food.y * this.tileSize;
        const center = this.tileSize / 2;

        // Pulsing effect
        const scale = 0.8 + Math.sin(timestamp / 200) * 0.1;
        const size = this.tileSize * scale;
        const offset = (this.tileSize - size) / 2;

        this.ctx.fillStyle = '#f44336';
        this.ctx.beginPath();
        this.ctx.arc(x + center, y + center, size / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Shine
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x + center - size / 4, y + center - size / 4, size / 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMessage(text) {
        // Not used but kept for compatibility
    }
}
