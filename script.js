const bob = document.getElementById("bob");
const game = document.querySelector(".game");
const wall = document.getElementById("wall");
const wall2 = document.getElementById("wall2");
const boost = document.getElementById("boost");
let currentLane = 1;
let died = false;
let boosted = false;
let score = 0;
updateBobPosition();
document.addEventListener("keydown", function(event) {
  if(!died){
  if (event.key === "ArrowLeft") {
    moveLeft();
  } else if (event.key === "ArrowRight") {
    moveRight();
  }
}
});

function moveLeft() {
  if (currentLane > 0) {
    currentLane--;
    updateBobPosition();
  }
}

function moveRight() {
  if (currentLane < 2) {
    currentLane++;
    updateBobPosition();
  }
}

function updateBobPosition() {
  const laneWidth = game.clientWidth / 3;
  bob.style.left = currentLane * laneWidth + (laneWidth - bob.clientWidth) / 2 + "px";
}
window.addEventListener("resize", function() {
  updateBobPosition();
});

function getRandomLane() {
  return Math.floor(Math.random() * 3);
}

function getRandomPosition(element) {
  const laneWidth = game.clientWidth / 3;
  const randomLane = getRandomLane();
  const randomLeft = randomLane * laneWidth + (laneWidth - element.clientWidth) / 2;
  return randomLeft;
}

function moveWall() {
  const randomLeft = getRandomPosition(wall);
  wall.style.left = randomLeft + "px";

  const randomLeft2 = getRandomPosition(wall2);
  if (randomLeft !== randomLeft2) {
    const shouldReplaceWithBoost = Math.random() < 0.06;
    if (shouldReplaceWithBoost) {
      boost.style.left = randomLeft2 + "px";
      wall2.style.left = "-100px";
    } else {
      wall2.style.left = randomLeft2 + "px";
      boost.style.left = "-100px";
    }
  }else{
    boost.style.left = "-100px";
    wall2.style.left = randomLeft2 + "px";
  }
}

moveWall();

wall.addEventListener("animationiteration", function () {
  moveWall();
});

setInterval(() => {
  if(!died){
  checkCollision();
  score++
  document.getElementById("score").innerText = score;
  }
}, 100);
function checkCollision() {
  if(!boosted){
  const bobRect = bob.getBoundingClientRect();
  const wallRect = wall.getBoundingClientRect();
  const wall2Rect = wall2.getBoundingClientRect();
  const boostRect = boost.getBoundingClientRect();

  if (
    bobRect.left < wallRect.right &&
    bobRect.right > wallRect.left &&
    bobRect.top < wallRect.bottom &&
    bobRect.bottom > wallRect.top
  ) {
    handleCollision();
  }

  if (
    bobRect.left < wall2Rect.right &&
    bobRect.right > wall2Rect.left &&
    bobRect.top < wall2Rect.bottom &&
    bobRect.bottom > wall2Rect.top
  ) {
    handleCollision();
  }

  if (
    bobRect.left < boostRect.right &&
    bobRect.right > boostRect.left &&
    bobRect.top < boostRect.bottom &&
    bobRect.bottom > boostRect.top
  ) {
    boostMode()
  }
}
}

function boostMode() {
  bob.style.backgroundImage = "url(img/1bob.png)";
  boosted = true;
  game.style.border = `2px solid red`;
  setTimeout(() => {
    boosted = false;
    bob.style.backgroundImage = "url(img/0bob.png)";
    game.style.border = `2px solid #000`;
  }, 5500);
}
function handleCollision() {
  bob.style.backgroundImage = "url(img/2bob.png)";
  document.getElementById("wall").style.animationPlayState = "paused";
  document.getElementById("wall2").style.animationPlayState = "paused";
  document.getElementById("boost").style.animationPlayState = "paused";
  died = true;
}

let speed = 1;
function updateAnimationSpeed() {
  wall.style.animationDuration = `calc(1s / ${speed})`;
  wall2.style.animationDuration = `calc(1s / ${speed})`;
  boost.style.animationDuration = `calc(1s / ${speed})`;
}
setInterval(() => {
  if(!died){

  speed += 0.1;
  updateAnimationSpeed();
  }
}, 10000);

