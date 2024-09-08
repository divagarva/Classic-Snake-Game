const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

canvas.width = 600;
canvas.height = 600;

const box = 20; // Size of each box
let snake = [{ x: 15 * box, y: 15 * box }]; // Snake's initial position
let direction;
let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box,
};
let score = 0;
let gameOver = false;

// Draw snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white'; // Head is green, body is white
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Draw food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
}

// Control snake direction
document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

// Move the snake
function moveSnake() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * 29 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box,
        };
    } else {
        // Remove the tail
        snake.pop();
    }

    // New head position
    let newHead = { x: snakeX, y: snakeY };

    // Check for collision with walls or snake body
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver = true;
        endGame();
    }

    snake.unshift(newHead); // Add new head
}

// Check for collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// End the game and display the game over screen
function endGame() {
    // Display the Game Over screen
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';
    finalScore.textContent = score;
}

// Restart game logic
function restartGame() {
    // Reset game variables
    snake = [{ x: 15 * box, y: 15 * box }];
    direction = null;
    score = 0;
    gameOver = false;
    food = {
        x: Math.floor(Math.random() * 29 + 1) * box,
        y: Math.floor(Math.random() * 29 + 1) * box,
    };

    // Reset score display
    document.getElementById('score').textContent = `Score: ${score}`;

    // Hide Game Over screen and show canvas
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';

    // Restart game loop
    loop();
}

// Draw everything
function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawFood();
    drawSnake();
    moveSnake();
}

// Handle restart button click
restartButton.addEventListener('click', restartGame);

// Call draw function every 150ms (slowed down)
function loop() {
    if (!gameOver) {
        setTimeout(() => {
            draw();
            loop();
        }, 150);
    }
}

loop();
