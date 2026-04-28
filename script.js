const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ball, paddle, bricks;
let dx, dy;
let score, lives, level, speed;

// START
function startGame() {
  level = 1;
  score = 0;
  lives = 3;

  speed = parseInt(document.getElementById("difficulty").value);

  initLevel();
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, 16);
}

// INIT LEVEL
function initLevel() {
  ball = { x: 300, y: 200, r: 8 };
  dx = speed;
  dy = -speed;

  paddle = { x: 250, y: 370, w: 100, h: 10 };

  bricks = [];
  let rows = 3 + level;
  let cols = 8;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({
        x: c * 70 + 35,
        y: r * 25 + 30,
        w: 60,
        h: 20,
        hp: 1 + Math.floor(level / 2)
      });
    }
  }
}

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BALL
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // PADDLE
  ctx.fillStyle = "cyan";
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  // BRICKS
  bricks.forEach(b => {
    if (b.hp > 0) {
      ctx.fillStyle = b.hp === 2 ? "orange" : "red";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  });

  // MOVE BALL
  ball.x += dx;
  ball.y += dy;

  // WALL COLLISION
  if (ball.x < ball.r || ball.x > canvas.width - ball.r) dx *= -1;
  if (ball.y < ball.r) dy *= -1;

  // PADDLE COLLISION
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.r > paddle.y
  ) {
    dy = -Math.abs(dy);

    // angle control (biar skill-based)
    let hit = ball.x - (paddle.x + paddle.w / 2);
    dx = hit * 0.1;
  }

  // FLOOR
  if (ball.y > canvas.height) {
    lives--;
    if (lives <= 0) {
      alert("Game Over!");
      clearInterval(gameLoop);
      return;
    }
    ball.x = 300;
    ball.y = 200;
    dx = speed;
    dy = -speed;
  }

  // BRICK COLLISION
  bricks.forEach(b => {
    if (
      b.hp > 0 &&
      ball.x > b.x &&
      ball.x < b.x + b.w &&
      ball.y > b.y &&
      ball.y < b.y + b.h
    ) {
      dy *= -1;
      b.hp--;
      score++;
    }
  });

  // LEVEL CLEAR
  if (bricks.every(b => b.hp === 0)) {
    level++;
    initLevel();
  }

  document.getElementById("info").innerText =
    `Score: ${score} | Lives: ${lives} | Level: ${level}`;
}

// CONTROL (mouse)
canvas.addEventListener("mousemove", e => {
  let rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

// CONTROL (keyboard)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") paddle.x -= 30;
  if (e.key === "ArrowRight") paddle.x += 30;
});

let gameLoop;
