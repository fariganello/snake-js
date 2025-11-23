export default class InputHandler {
    constructor() {
        this.direction = { x: 0, y: -1 }; // Default Up
        this.nextDirection = { x: 0, y: -1 };

        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                    break;
            }
        });
    }

    getDirection() {
        this.direction = this.nextDirection;
        return this.direction;
    }

    reset() {
        this.direction = { x: 0, y: -1 };
        this.nextDirection = { x: 0, y: -1 };
    }
}
