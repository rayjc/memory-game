const gameContainer = document.getElementById("game");
const gameSetup = document.querySelector(".setup");
const currScore = document.querySelector("#current-score");
const bestScore = document.querySelector("#best-score");
const diffSlider = document.querySelector("#difficulty");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// let shuffledColors = shuffle(COLORS);


function createRandomRGB(){
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgb(${r},${g},${b})`;
}

function createRandomColors(num){
  let colors = [];
  for (let i = 0; i < num; i++) {
    colors.push(createRandomRGB());
  }
  return colors;
}

function createColorDeck(num){
  let colors = createRandomColors(Math.round(num/2));
  return colors.concat(colors);
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a data attribute for the value we are looping over
    newDiv.setAttribute('data-color', color);

    newDiv.classList.add('card');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let faceUpPair = [];
let faceUpLock = false;
let score = 0;
// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);
  if (faceUpPair.length < 2) {
    if (!event.target.style.backgroundColor){
      // reveal card
      event.target.style.backgroundColor = event.target.getAttribute('data-color');
      if (!faceUpLock){
        // synchronize on write
        faceUpLock = true;
        faceUpPair.push(event.target);  // add card to array
        faceUpLock = false;
      }
      // increment score
      score++;
      currScore.innerText = score;
      //console.log(faceUpPair);
    }
  }
  if (faceUpPair.length == 2) {
    //console.log(faceUpPair);
    if (faceUpPair[0].style.backgroundColor !== faceUpPair[1].style.backgroundColor) {
      if (!faceUpLock){
        // lock faceUpPair until after timeout
        faceUpLock = true;
        setTimeout(() => {
          // hide cards
          for (let card of faceUpPair){
            card.style.backgroundColor = "";
          }
          faceUpPair = [];
          faceUpLock = false;
        }, 1000);
      }
    } else {
      if (!faceUpLock){
        // synchronize on write
        faceUpLock = true;
        faceUpPair = [];
        faceUpLock = false;
      }
    }
  }
  //console.log("Game Over: ", isGameOver());
  // show restart button if game over
  if (isGameOver() && !gameSetup.querySelector("#restart")){
    if (localStorage.bestScore){
      const lowestScore = score < localStorage.bestScore ? score : localStorage.bestScore;
      localStorage.setItem("bestScore", lowestScore);
    }
    else {
      localStorage.setItem("bestScore", score);
    }
    bestScore.innerText = localStorage.bestScore; // update display
    gameSetup.querySelector('#setup-restart').appendChild(createRestartBtn());
  }
}

function isGameOver(){
  let cards = Array.from(gameContainer.children);
  if (cards){
    // check if all cards have backgroundColor
    return cards.every((div) => div.style.backgroundColor);
  }
  return false;
}

function createRestartBtn(){
  newBtn = document.createElement("button");
  newBtn.innerText = "Restart";
  newBtn.id = "restart";
  return newBtn;
}

function restart(){

  // reset state
  faceUpPair = [];
  faceUpLock = false;
  // reset current score
  score = 0;
  currScore.innerText = score;
  // remove all backgroundColor
  for (let card of gameContainer.children) {
    card.style.backgroundColor = "";
  }
  // remove restart button
  const restartBtn = gameSetup.querySelector("#restart");
  if (restartBtn) {
    restartBtn.remove();
  }
}

function init(){
  while(gameContainer.firstElementChild){
    gameContainer.firstElementChild.remove();
  }
  let shuffledColors = shuffle(createColorDeck(diffSlider.value));
  // create blocks of random color
  createDivsForColors(shuffledColors);
  restart();
}

// when the DOM loads
document.querySelector('.setup').addEventListener('click', function(event){
  if (event.target.id === "new-game"){
    init();
  } else if (event.target.id === "restart"){
    console.log("Clicked restart");
    restart();
  }
});

let sliderTimerId;
diffSlider.addEventListener('mousedown', function (event) {
  console.log(event);
  sliderTimerId = setInterval(function(){
    document.querySelector('#deck-size').innerText = event.target.value;
  }, 100);
});
diffSlider.addEventListener('mouseup', function (event) {
  clearInterval(sliderTimerId);
});

// update best score from data
if (localStorage.bestScore) {
  bestScore.innerText = localStorage.bestScore;
}
diffSlider.value = 6;