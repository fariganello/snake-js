import Snake from './entities/Snake.js';
import Food from './entities/Food.js';
import InputHandler from './utils/InputHandler.js';
import Renderer from './utils/Renderer.js';
import SoundManager from './utils/SoundManager.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.gridSize = 20; // 20x20 grid
        this.tileSize = this.width / this.gridSize;

        this.inputHandler = new InputHandler();
        this.renderer = new Renderer(this.ctx, this.width, this.height, this.gridSize, this.tileSize);
        this.soundManager = new SoundManager();

        this.snake = new Snake(this.gridSize);
        this.food = new Food(this.gridSize);

        this.lastTime = 0;
        this.tickInterval = 150; // 150ms
        this.accumulatedTime = 0;

        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;

        this.bindEvents();
        this.updateScore();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (this.state === 'MENU' || this.state === 'GAMEOVER') {
                // Prevent restarting immediately if just died or just loaded, wait for explicit key press
                // But for now, any key starts game from menu
                if (this.state === 'MENU' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    this.startGame();
                }
            }
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) {
            this.tickInterval = parseInt(difficultySelect.value);
        }

        this.reset();
        this.state = 'PLAYING';
        this.lastTime = performance.now();
        this.accumulatedTime = 0;
        requestAnimationFrame((ts) => this.loop(ts));
    }

    reset() {
        this.snake = new Snake(this.gridSize);
        this.food = new Food(this.gridSize);
        this.food.spawn(this.snake.body); // Ensure food doesn't spawn on snake
        this.score = 0;
        this.inputHandler.reset();
        this.updateScore();

        // Hide screens
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    start() {
        this.renderer.drawGrid(); // Initial draw
        this.renderer.drawMessage("Press Arrow Keys to Start");
    }

    loop(timestamp) {
        if (this.state !== 'PLAYING') return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulatedTime += deltaTime;

        if (this.accumulatedTime >= this.tickInterval) {
            this.update();
            this.accumulatedTime -= this.tickInterval;
        }

        this.render(timestamp);
        requestAnimationFrame((ts) => this.loop(ts));
    }

    update() {
        const direction = this.inputHandler.getDirection();
        this.snake.move(direction);

        if (this.checkCollision()) {
            this.gameOver();
            return;
        }

        if (this.snake.eat(this.food)) {
            this.score++;
            this.updateScore();
            this.soundManager.playEat();
            this.food.spawn(this.snake.body);
        }
    }

    checkCollision() {
        if (this.snake.checkWallCollision(this.gridSize)) return true;
        if (this.snake.checkSelfCollision()) return true;
        return false;
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.soundManager.playGameOver();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }

        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('active');
        document.getElementById('final-score').innerText = this.score;
    }

    updateScore() {
        document.getElementById('score').innerText = this.score;
        const highScoreEl = document.getElementById('high-score');
        if (highScoreEl) {
            highScoreEl.innerText = this.highScore;
        }
    }

    render(timestamp) {
        this.renderer.clear();
        this.renderer.drawGrid();
        this.renderer.drawFood(this.food, timestamp);
        this.renderer.drawSnake(this.snake);
    }
}
