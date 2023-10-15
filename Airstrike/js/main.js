// [TODO]: Menu before starting the game
// [TODO]: Score table

const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const localStorage = window.localStorage;

// Game settings
let renderTimer,              // Timer for game rendering
    spanwTimer,               // Timer for spawning units
    shootCounter,             // Timer for automatic shooting
    spawnTime = 2500,         // Interval between unit spawns
    scoreCount = 0,           // Score counter
    livesCount = 5,           // Lives counter
    levelsCount = 0,          // Levels counter
    rocketsCount = 10,        // Rocket counter
    killsCount = 0,           // Killed enemies counter
    vx = 0,                   // Deviation along x
    kLvl = 0,                 // Coefficient for strengthening enemy units
    isPaused = false,         // Is the game paused
    isBossStage = false;      // Is the level in boss stage

const fps = 1000/60;                     // Number of game board updates per second
const CENTER = canvas.height/2 - 30;     // Center of the canvas - initial character coordinate

const gameboard = document.getElementsByClassName('gameboard')[0];
const cursor = document.getElementsByTagName('body')[0];

// Arrays for bullets and enemies respectively
let bullets = [],
    enemies = [];

// Main class for all moving units
class Unit {
  constructor(x, y, img) {
    this.x = x || canvas.width;
    this.y = y || CENTER;
    this.width = 80;
    this.height = 60;
    this.isShielded = false;
    this.img = img || enemy_img;
  }
  shield() {
    this.isShielded = true;
    setTimeout(() => this.isShielded = false, 500);
  }
  draw() {
    if (this.isShielded)  {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
    else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}

// Subclass for the player unit
class Player extends Unit {
  constructor(x, y, img) {
    super(x, y, img);
    this.hp = livesCount;
  }
  move(mouseY) {
    this.y = mouseY;
  }
  shoot(mouseY, num) {
    let bullet;
    switch (num) {
      case 0:
        bullet = new Gun(10, mouseY);
        break;
      case 1:
        if (rocketsCount > 0) {
          bullet = new Rocket(10, mouseY);
          changeRockets(-1);
        }
        break;
    };
    if (bullet !== undefined) bullets.push(bullet);
  }
}

// Subclass for enemy units
class EnemyPlane extends Unit {
  constructor(x, y) {
    super(x, y);
    this.hp = 2 + 2*kLvl;
    this.speed = 3.5 + 0.1*kLvl;
    this.value = 50;
    this.dmg = 1;
    this.isBoss = false;
  }
  move() {
    this.x -= this.speed;
  }
}

// Sub-subclass for non-default enemy units
class EliteEnemyPlane extends EnemyPlane {
  constructor(x, y) {
    super(x, y);
    this.width = 100;
    this.height = 75;
    this.hp = 3 + 3*kLvl;
    this.speed = 4.5 + 0.1*kLvl;
    this.value = 75;
    this.img = elite_enemy_img;
  }
}

// Sub-subclass for non-default enemy units
class HeavyEnemyPlane extends EnemyPlane {
  constructor(x, y) {
    super(x, y);
    this.width = 120;
    this.height = 90;
    this.hp = 5 + 5*kLvl;
    this.speed = 3 + 0.1*kLvl;
    this.value = 100;
    this.img = heavy_enemy_img;
  }
}

// Sub-subclass for non-default enemy units
class Boss extends EnemyPlane {
  constructor(x) {
    super(x);
    this.y = CENTER - 120 + 30;
    this.width = 360;
    this.height = 240;
    this.hp = 15 + 10*kLvl;
    this.speed = 1.5 + 0.1*kLvl;
    this.value = 300;
    this.dmg = 5;
    this.img = boss_img;
    this.isBoss = true;
  }
}

// Main class for all bullets
class Bullet {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img || gun_img;
    this.width = 60;
    this.height = 30;
  }
  move() {
    this.x += this.speed;
  }
  checkCollision() {
    let findEnemy = enemies.find(enemy => ( ( (this.y + 15 - enemy.y >= 0) && (this.y + 15 - enemy.y <= enemy.height) )
    && (this.x - enemy.x >= 0) && (this.x - enemy.x <= this.speed) && (!enemy.isShielded) ) );
    if (findEnemy) {
      findEnemy.hp -= this.dmg;
      bullets.splice(bullets.indexOf(this), 1);
      if (findEnemy.hp <= 0) {
        incKills(findEnemy);
        if (findEnemy.isBoss) completeBossStage();
      }
      else findEnemy.shield();
    }
    else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}

// Subclass for bullets from the regular gun
class Gun extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.dmg = 3 + 2*kLvl;
    this.speed = 50;
    this.img = rocket_img;
  }
}

// Subclass for bullets from the rocket launcher
class Rocket extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.dmg = 3 + 2*kLvl;
    this.speed = 20;
    this.img = rocket_img;
  }
  move() {
    this.x += this.speed;
    this.y += Math.random() * (5 - 10) + 5;
  }
}

// Rendering the game field
function renderGame() {
  renderTimer = setInterval(() => {
    if (isPaused) return false;

    ctx.clearRect(0, 0, 1920*2, 1080);

    ctx.drawImage(clouds_1, vx, 0);
    ctx.drawImage(clouds_2, vx, 0);
    ctx.drawImage(clouds_3, vx, 0);
    ctx.drawImage(clouds_4, vx, 0);
    ctx.drawImage(clouds_1, vx+1920, 0);
    ctx.drawImage(clouds_2, vx+1920, 0);
    ctx.drawImage(clouds_3, vx+1920, 0);
    ctx.drawImage(clouds_4, vx+1920, 0);

    ctx.font = "30px Arial";
    ctx.fillText(`🏅: ${scoreCount}`, 20, 50);
    ctx.fillText(`❤️: ${livesCount}`, 20, 120, 100);
    if (isBossStage) ctx.fillText(`Boss stage!`, 100, 120);

    player.draw();

    // If player's health < 1 - game over
    if (livesCount <= 0) {
      let inner = `<h1>Enter your name:</h1>\
                    <span>${scoreCount} points</span>\
                    <input type="text">\
                    <button class="popupBtn" type="submit" onclick="addResult()">Submit</button>`;
      showPopup(gameboard, inner);
      clearInterval(renderTimer);
    }

    // Move all bullets
    bullets.forEach(el => {
      el.move();
      el.checkCollision();

      // If bullet goes off-screen - remove it
      if (el.x >= canvas.width) bullets.splice(bullets.indexOf(el), 1);
    });

    // Move all enemy units
    enemies.forEach(el => {
      el.move();
      el.draw();

      // If unit goes off-screen - remove it
      if (el.x <= -el.width) {
        // If player is not shielded - deduct health
        if (!player.isShielded) changeLives(-el.dmg);
        player.shield();
        enemies.splice(enemies.indexOf(el), 1);
      }
    });

    vx -= 2;
    if (vx < -1920) vx = 0;
  }, fps);
}

// Initiating enemy unit creation
function addEnemy() {
  setTimeout(() => createEnemy(), 3000);
}

// Creating enemy units
function createEnemy() {
  spanwTimer = setInterval(() => {
    if (isPaused || isBossStage) return false;
    let y = Math.round(Math.random() * (canvas.height - 150) + 75);
    let enemy;
    let num = Math.random();
    switch (levelsCount) {
      case (0):
        enemy = new EnemyPlane(canvas.width, y);
        break;
      case (1):
        if (num >= 0 && num <= 0.25) enemy = new HeavyEnemyPlane(canvas.width, y);
        else if (num >= 0.25 && num <= 0.5) enemy = new EliteEnemyPlane(canvas.width, y);
        else enemy = new EnemyPlane(canvas.width, y);
        break;
      case (2):
        if (num >= 0 && num <= 0.25) enemy = new HeavyEnemyPlane(canvas.width, y);
        else if (num >= 0.25 && num <= 0.75) enemy = new EliteEnemyPlane(canvas.width, y);
        else enemy = new EnemyPlane(canvas.width, y);
        break;
      case (3):
        if (num >= 0 && num <= 0.25) enemy = new HeavyEnemyPlane(canvas.width, y);
        else enemy = new EliteEnemyPlane(canvas.width, y);
        break;
      default:
        if (num >= 0 && num <= 0.5) enemy = new HeavyEnemyPlane(canvas.width, y);
        else enemy = new EliteEnemyPlane(canvas.width, y);
        break;
    }
    enemies.push(enemy);
  }, spawnTime);
}

// Changing the score
function incScore(value) {
  scoreCount += value;
  if (Math.floor(scoreCount / 500) > levelsCount && !isBossStage) startBossStage();
}

// Changing the number of lives
function changeLives(value) {
  livesCount += value;
}

// Increasing the level
function incLevel() {
  levelsCount += 1;
  kLvl = Math.pow(levelsCount, 2);
  isBossStage = !isBossStage;
}

// Changing the number of rockets
function changeRockets(value) {
  rocketsCount += value;
}

// Increasing the number of killed enemies
function incKills(el) {
  incScore(el.value);
  enemies.splice(enemies.indexOf(el), 1);
  killsCount += 1;
  if (killsCount % 10 == 0) changeRockets(5);
}

// Initiating a boss stage for the level
function startBossStage() {
  let enemy = new Boss();
  enemies.push(enemy);
  isBossStage = !isBossStage;
}

// Completing a boss stage for the level
function completeBossStage() {
  incLevel();
}

const clouds_1 = new Image(); clouds_1.src = './assets/game_background_1/layers/clouds_1.png';
const clouds_2 = new Image(); clouds_2.src = './assets/game_background_1/layers/clouds_2.png';
const clouds_3 = new Image(); clouds_3.src = './assets/game_background_1/layers/clouds_3.png';
const clouds_4 = new Image(); clouds_4.src = './assets/game_background_1/layers/clouds_4.png';

const player_img = new Image(); player_img.src = './assets/Plane/Fly(1).png';
const enemy_img = new Image(); enemy_img.src = './assets/Plane/Flying_Enemy(1).png';
const elite_enemy_img = new Image(); elite_enemy_img.src = './assets/Plane/Flying_Enemy_Elite(1).png';
const heavy_enemy_img = new Image(); heavy_enemy_img.src = './assets/Plane/Flying_Enemy_Heavy(1).png';
const boss_img = new Image(); boss_img.src = './assets/Plane/Flying_Enemy_Boss(1).png';

const gun_img = new Image(); gun_img.src = './assets/Bullet/Bullet(1).png';
const rocket_img = new Image(); rocket_img.src = './assets/Bullet/Missile(1).png';

// Start the game after loading images
if (document.images) {
  startGame();
}

function startGame() {
  renderGame();
  addEnemy();
}

const player = new Player(10, CENTER, player_img);

canvas.addEventListener('mousemove', e => {
  if (isPaused) return false;
  let bounds = canvas.getBoundingClientRect();
  let mouseY = e.clientY - bounds.top - scrollY - player.height / 2;
  if (canvas.height - mouseY < 60) mouseY = canvas.height - 60;
  else if (mouseY < 0) mouseY = 0;
  player.move(mouseY);
});

canvas.addEventListener('mousedown', e => {
  if (isPaused) return false;
  if (canvas.height - player.y < 60)
    mouseY = canvas.height - 40;
  // If the left mouse button was pressed - call shoot with 0
  // Otherwise, call shoot with 1
  changeCursor();
  if (detectLeftButton(e)) {
    player.shoot(player.y + 30, 0);
    shootCounter = setInterval(() => player.shoot(player.y + 30, 0), 200);
  } else player.shoot(player.y, 1);
});

canvas.addEventListener('mouseup', () => {
  clearInterval(shootCounter);
});

canvas.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (e.which == 32) isPaused = !isPaused;
});

// Helper function to detect the type of mouse button pressed
function detectLeftButton(e) {
  if ('buttons' in e) {
    return e.buttons === 1;
  } else if ('which' in e) {
    return e.which === 1;
  } else {
    return e.button == 1 || e.type == 'click';
  }
}

// Helper function to change cursor color on click
function changeCursor() {
  cursor.style = "cursor: url('./assets/Cursor/crosshair_hit.png'), pointer";
  setTimeout(() => {
    cursor.style = "cursor: url('./assets/Cursor/crosshair.png'), pointer;";
  }, 100);
}

// Helper function to show a popup window
function showPopup(parent, inner) {
  let popUp = document.createElement('div');
  popUp.className = 'popup';
  popUp.innerHTML = inner;
  parent.insertBefore(popUp, parent.childNodes[0]);
}

// Helper function to get data from the popup window
function addResult() {
  let name = document.getElementsByTagName('input')[0].value;
  if (name == undefined) return false;
  localStorage.setItem(name, scoreCount);
  closePopup(gameboard);
  showLeaderBoard();
}

// Helper function to close the popup window
function closePopup(parent) {
  if (parent == undefined) parent = gameboard;
  let popUp = parent.getElementsByClassName('popup')[0];
  parent.removeChild(popUp);
}

// Helper function to show the leaderboard table
function showLeaderBoard() {
  let lsArr = getSortedLocalStorage();
  let inner = '<h1>Leaderboard:</h1>\
              <table>\
              <tr>\
              <th>Name</th>\
              <th>Score</th>\
              </tr>';

  // Display the top 10 results
  for (let i = 0; i < 10; i++) {
    let medal = '';
    switch (i) {
      case (0):
        medal = '🥇 ';
        break;
      case (1):
        medal = '🥈 ';
        break;
      case (2):
        medal = '🥉 ';
        break;
    }

    if (lsArr[i] == undefined) continue;
    inner += `<tr>\
              <td class="name">${medal}${lsArr[i].name}</td>\
              <td class="score">${lsArr[i].score}</td>\
              </tr>`;
  }
  inner += '</table>\
            <button class="popupBtn" type="submit" onclick="{closePopup(); restartGame()}">Restart</button>';
  showPopup(gameboard, inner);
}

// Helper function to get records from localstorage as a sorted array in ascending order
function getSortedLocalStorage() {
  let localStorageArr = [];

  // Fill the array with records from localstorage
  for (let i = 0; i < localStorage.length; i++)
    localStorageArr.push({ name: localStorage.key(i), score: localStorage.getItem(localStorage.key(i)) });

  // Bubble sort magic for sorting
  for (let i = 0; i < localStorage.length; i++)
    for (let j = 0; j < localStorage.length; j++)
      if (parseInt(localStorageArr[i].score) > parseInt(localStorageArr[j].score)) {
        let temp = localStorageArr[i];
        localStorageArr[i] = localStorageArr[j];
        localStorageArr[j] = temp;
      }
  return localStorageArr;
}


// The only thing I couldn't figure out is how to reset variables differently when restarting the game
// I also don't want to remove them from the beginning of the code, as the settings should be visible!
// So, I just copied the code above and put it into separate functions to make it less awkward
function restartGame() {
  clearInterval(renderTimer);
  clearInterval(spanwTimer);
  ctx.clearRect(0, 0, 1920 * 2, 1080);
  updateStats();
  startGame();
}

function updateStats() {
  scoreCount = 0;           // Score counter
  livesCount = 5;           // Lives counter
  levelsCount = 0;          // Levels counter
  rocketsCount = 10;        // Rocket counter
  killsCount = 0;           // Enemy kills counter
  vx = 0;                   // Deviation on x-axis
  kLvl = 0;                 // Coefficient for strengthening enemy units
  isPaused = false;         // Is the game paused
  isBossStage = false;      // Is the level in boss stage
  bullets = [];
  enemies = [];
}