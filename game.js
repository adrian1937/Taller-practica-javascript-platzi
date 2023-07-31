const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUP = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#Time');
const spanRecord = document.querySelector('#Record');
const pResult = document.querySelector('#Result');

const playerPosition = {
   x: undefined,
   y: undefined,
};
const giftPosition = {
   x: undefined,
   y: undefined,
};
let bombPosition = [];
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let canvasSize;
let elementSize;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber(n) {
  return Number(n.toFixed(2));
}

function setCanvasSize() {
   if (window.innerHeight > window.innerWidth) {
      canvasSize = window.innerWidth * 0.7;
   } else{
      canvasSize = window.innerHeight * 0.7;
   }

   canvasSize = Number(canvasSize.toFixed(0));

   canvas.setAttribute('height', canvasSize);
   canvas.setAttribute('width', canvasSize);
   
   elementSize = canvasSize / 10;

   playerPosition.x = undefined;
   playerPosition.y = undefined;

   startGame();
}

function startGame() {
   console.log({canvasSize, elementSize});

   game.font = elementSize + 'px Verdana';
   game.textAlign = 'end';

   const map = maps[level];

   if (!map) {
      gameWin();
      return;
   }

   if (!timeStart) {
      timeStart = Date.now();
      timeInterval = setInterval(showTime, 100);
      showRecord();
   }

   const mapRows = map.trim().split('\n');
   const mapRowsCols = mapRows.map(row => row.trim().split(''));
   console.log({map, mapRows, mapRowsCols});

   showLives();

   bombPosition = [];

   game.clearRect(0,0, canvasSize,canvasSize)


   mapRowsCols.forEach((row, rowI) => {
      row.forEach((col, colI) => {
         const emoji = emojis[col];
         const posX =elementSize * (colI + 1);
         const posY =elementSize * (rowI + 1);
         game.fillText(emoji, posX, posY)
         console.log({ row, rowI, col, colI})

         if (col == 'O') {
           if (!playerPosition.x && !playerPosition.y){
            playerPosition.x = posX;
            playerPosition.y = posY;
            console.log({playerPosition});
           }
         } else if(col == 'I') {
            giftPosition.x = posX;
            giftPosition.y = posY;
         } else if(col == 'X') {
            bombPosition.push({
               x: posX,
               y: posY,
            });
         }

         game.fillText(emoji, posX, posY);
      });
   });
   movePlayer();
}

function movePlayer() {
   const giftCollitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
   const giftCollitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
   const giftCollision = giftCollitionX && giftCollitionY;


   if (giftCollision){
      levelWin();
   }
   game.fillText(emojis['Player'], playerPosition.x, playerPosition.y);

   const bombCollision = bombPosition.find(bomb => {
      const bombCollisionX = bomb.x.toFixed(3) == playerPosition.x.toFixed(3);
      const bombCollisionY = bomb.y.toFixed(3) == playerPosition.y.toFixed(3);
      return bombCollisionX && bombCollisionY;
   });

   
   if (bombCollision){
      levelFail();
   }

}

function levelFail(){
   lives--;

   console.log('chocaste con una bomba');

   if (lives <= 0) {
      level = 0;
      lives = 3;
      timeStart = undefined;
   }
   playerPosition.x = undefined;
   playerPosition.y = undefined;
   startGame();
}

function levelWin() {
   console.log('subistedenivel')
   level++;
   startGame();
}

function gameWin() {
   console.log('terminaste el juego :) !!!!!!!');
   clearInterval(timeInterval);

   const recordTime = localStorage.getItem('record_time')
   const playerTime = Date.now() - timeStart;

   if (recordTime) {
      if (recordTime >= playerTime) {
         localStorage.setItem('record_time', playerTime)
         pResult.innerHTML = 'superastes el record!!!!!!!';
      } else {
         pResult.innerHTML = 'lo siento, no superaste el record :(';
      }
   } else {
      localStorage.setItem('record_time', playerTime)
      pResult.innerHTML = 'primera vez?';
   }

   console.log(recordTime)
}

function showLives() {
   const heartsArray = Array (lives).fill(emojis['HEART']); // [1,2,3]
   //console.log(heartsArray);

   spanLives.innerHTML = "";
   heartsArray.forEach(heart => spanLives.append(heart))
}

function showTime() {
   spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
   spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUP.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);

function moveByKeys(event){
   if (event.key == 'ArrowUp'){
     moveUp();
   } else if (event.key == 'ArrowDown'){
      moveDown();
    } else if (event.key == 'ArrowLeft'){
      moveLeft();
    } else if (event.key == 'ArrowRight'){
      moveRight();
    }
}

function moveUp() {
   console.log('me quiero ir hacia arriva');
   if ((playerPosition.y - elementSize) < elementSize) {
      console.log('OUT')
   } else {
   playerPosition.y -= elementSize
   startGame();
   }
}

function moveDown() {
   console.log('me quiero ir hacia abajo');
   if ((playerPosition.y + elementSize) > canvasSize) {
      console.log('OUT')
   } else {
   playerPosition.y += elementSize
   startGame();
   }
}

function moveLeft() {
   console.log('me quiero ir hacia la izquierda');
   if ((playerPosition.x - elementSize) < elementSize) {
      console.log('OUT')
   } else {
   playerPosition.x -= elementSize
   startGame();
   }
}

function moveRight() {
   console.log('me quiero ir hacia la derecha');
   if ((playerPosition.x + elementSize) > canvasSize) {
      console.log('OUT')
   } else {
   playerPosition.x += elementSize
   startGame();
   }
}