const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// ตั้งค่าขนาดกริด (Grid)
const gridSize = 20; // ขนาดต่อบล็อก (px)
const tileCount = canvas.width / gridSize; // จำนวนบล็อกต่อแถว/คอลัมน์ (20x20)

let snake = [{ x: 10, y: 10 }]; // ตัวงู (จุดเริ่มต้นกลางจอ)
let dx = 1; // ทิศทาง X (1 = ขวา, -1 = ซ้าย)
let dy = 0; // ทิศทาง Y (1 = ลง, -1 = ขึ้น)
let coin = { x: 15, y: 15 }; // ตำแหน่งเหรียญเริ่มต้น
let score = 0;
let gameInterval;
let isGameOver = false;

// เริ่มวนลูปเกม
function startGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  isGameOver = false;
  scoreElement.textContent = score;
  generateCoin();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100); // อัปเดตทุก 100ms
}

function gameLoop() {
  if (isGameOver) return;

  updatePosition();
  checkCollision();
  draw();
}

// อัปเดตตำแหน่งงู
function updatePosition() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); // เพิ่มหัวใหม่ไปข้างหน้า

  // ตรวจสอบว่าเก็บเหรียญได้หรือไม่
  if (head.x === coin.x && head.y === coin.y) {
    score += 10;
    scoreElement.textContent = score;
    generateCoin();
  } else {
    snake.pop(); // ถ้าไม่ได้กินเหรียญ ให้ตัดส่วนหางออกเพื่อรักษาความยาวเท่าเดิม
  }
}

// สุ่มสร้างเหรียญใหม่ในตำแหน่งที่ไม่ทับกับตัวงู
function generateCoin() {
  while (true) {
    coin.x = Math.floor(Math.random() * tileCount);
    coin.y = Math.floor(Math.random() * tileCount);

    let isOnSnake = snake.some(segment => segment.x === coin.x && segment.y === coin.y);
    if (!isOnSnake) break;
  }
}

// ตรวจสอบการชนขอบจอหรือชนตัวเอง
function checkCollision() {
  const head = snake[0];

  // ชนขอบกำแพง
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
  }

  // ชนลำตัวตัวเอง
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// วาดกราฟิกบน Canvas
function draw() {
  // ล้างหน้าจอ
  ctx.fillStyle = '#0f3460';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // วาดเหรียญ (สีทองทรงกลม)
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(
    coin.x * gridSize + gridSize / 2,
    coin.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // วาดงู
  snake.forEach((segment, index) => {
    // หัวงูสีเขียวสว่าง ลำตัวสีเขียวปกติ
    ctx.fillStyle = index === 0 ? '#4ecca3' : '#22b573';
    ctx.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );
  });
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e94560';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = '#ffffff';
  ctx.font = '16px sans-serif';
  ctx.fillText(`คะแนนรวม: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// ตรวจจับการกดคีย์บอร์ด
document.addEventListener('keydown', (e) => {
  // ป้องกันการเดินถอยหลังชนตัวเองทันที
  if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) {
    dx = 0; dy = -1;
  } else if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) {
    dx = 0; dy = 1;
  } else if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) {
    dx = -1; dy = 0;
  } else if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) {
    dx = 1; dy = 0;
  }
});

restartBtn.addEventListener('click', startGame);

// เริ่มเกมเมื่อโหลดหน้าเว็บ
startGame();