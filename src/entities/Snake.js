export default class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        // Start in the middle
        const startX = Math.floor(gridSize / 2);
        const startY = Math.floor(gridSize / 2);

        this.body = [
            { x: startX, y: startY },
            { x: startX, y: startY + 1 }, // Tail
            { x: startX, y: startY + 2 }  // Tail
        ];

        this.direction = { x: 0, y: -1 }; // Moving Up initially
        this.newDirection = { x: 0, y: -1 };
    }

    move(direction) {
        // Update direction from input (if valid)
        // Prevent reversing
        if (direction.x !== 0 && this.direction.x === 0) {
            this.direction = direction;
        } else if (direction.y !== 0 && this.direction.y === 0) {
            this.direction = direction;
        }

        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        this.body.unshift(newHead);
        this.body.pop(); // Remove tail unless eating (handled in Game.js or here? Game.js handles eating logic usually, but growth is here)
        // Wait, if I pop here, I can't grow easily. 
        // Better: Game.js calls move, then checks collision/eat. If eat, we need to grow.
        // So maybe move() just adds head, and we have a separate method to remove tail?
        // Or move() returns the popped tail so we can put it back?
        // Standard way: Move always moves. If we eat, we add a segment (duplicate tail or just don't pop).
        // Let's stick to: Move updates positions. If eat, we grow.
        // To support "don't pop if eat", we can pass a flag or have a grow method.
        // Let's have a grow method that appends a segment (or just doesn't pop in the next move? No, that's complex).
        // Simplest: Move always pops. If we ate, we call grow() which adds a segment at the tail position (we need to know where the tail was).
    }

    // Revised move to support growth:
    // Actually, if we eat, we usually just don't pop the tail.
    // So let's change move to take a 'shouldGrow' param? No, Game checks collision after move.
    // So:
    // 1. Calculate new head.
    // 2. Add new head.
    // 3. Remove tail.
    // 4. Return tail (in case we need to restore it? No).

    // If we eat:
    // We need to add a segment. Where? At the old tail position.
    // So we need to store the last removed tail?

    // Let's do this:
    // move() adds head, removes tail, saves it to this.lastTail.
    // grow() adds this.lastTail back to body.

    move(direction) {
        if (direction) {
            if (direction.x !== 0 && this.direction.x === 0) {
                this.direction = direction;
            } else if (direction.y !== 0 && this.direction.y === 0) {
                this.direction = direction;
            }
        }

        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        this.body.unshift(newHead);
        this.lastTail = this.body.pop();
    }

    eat(food) {
        const head = this.body[0];
        if (head.x === food.x && head.y === food.y) {
            this.grow();
            return true;
        }
        return false;
    }

    grow() {
        if (this.lastTail) {
            this.body.push(this.lastTail);
        }
    }

    checkWallCollision(gridSize) {
        const head = this.body[0];
        return (
            head.x < 0 ||
            head.x >= gridSize ||
            head.y < 0 ||
            head.y >= gridSize
        );
    }

    checkSelfCollision() {
        const head = this.body[0];
        // Check if head hits any other body part
        // Start from index 1
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}
