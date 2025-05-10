const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

let gameState = {
  paddles: { left: { y: 50, score: 0 }, right: { y: 50, score: 0 } },
  ball: { x: 400, y: 300, radius: 8 },
  blocks: []
};

socket.on('gameState', (state) => {
  gameState = state;
});

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw scores
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText(gameState.paddles.left.score, 50, 30);
  ctx.fillText(gameState.paddles.right.score, canvas.width - 80, 30);

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(10, gameState.paddles.left.y, 10, 100);
  ctx.fillRect(canvas.width - 20, gameState.paddles.right.y, 10, 100);

  // Draw ball
  ctx.beginPath();
  ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // Draw blocks with colors
  gameState.blocks.forEach(block => {
    if (block.active) {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, 50, 40);
    }
  });
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top - 50;
    const canvasX = e.clientX - rect.left; // Get X position relative to canvas
    const side = canvasX < canvas.width / 2 ? 'left' : 'right';
    socket.emit('paddleMove', { 
      side, 
      y: Math.max(0, Math.min(500, y)) 
    });
  });

gameLoop();