localStorage.bestScore = "--";

let restartButton = document.querySelector("#restartButton");
let startButton = document.querySelector("#startButton");
let splashScreen = document.querySelector(".splashScreen");
let game = document.querySelector(".game");
let score = document.querySelector("#score");
let endScore = document.querySelector("#endScore");
let cardTypes = [
  { name: "abduction", img: "img/abduction.png" },
  { name: "astronaut", img: "img/astronaut.png" },
  { name: "flag", img: "img/flag.png" },
  { name: "meteor", img: "img/meteor.png" },
  { name: "milky", img: "img/milky.png" },
  { name: "spaceship", img: "img/spaceship.png" },
  { name: "telescope", img: "img/telescope.png" },
  { name: "saturn", img: "img/saturn.png" }
];

let cards = cardTypes.concat(cardTypes); //double the cards so there are pairs
let selectedCards; //this is being used to track the cards selected in a round
let grid, totalClicks, matched;

//do not display the game area until the start button is clicked
game.style.display = "none";

//initiates the creation of the game area
//hides the start game splash page and display the game area when start button is clicked
startButton.addEventListener("click", function() {
  startGame();
  splashScreen.style.display = "none";
  game.style.display = "initial";
});

//reset game listener
restartButton.addEventListener("click", startGame);

//reset values, remove grid (game board) if exists, and shuffle cards for game (recreating grid)
function startGame() {
  matched = 0;
  totalClicks = 0;
  selectedCards = [];
  score.innerText = `Best Score:${localStorage.bestScore}
	Moves:${totalClicks}`;

  if (grid !== undefined) {
    game.removeChild(grid);
  }

  grid = document.createElement("section");
  grid.classList.add("grid");
  game.appendChild(grid);
  shuffle();
}

//Shuffle cards and apply cards to board
function shuffle() {
  for (let i = cards.length - 1; i >= 0; i--) {
    let randomInd = Math.floor(Math.random() * (i + 1));
    let itemAtInd = cards[randomInd];
    cards[randomInd] = cards[i];
    cards[i] = itemAtInd;
  }

  //Create an elements for cards and apply a shuffled card to each
  for (let item of cards) {
    //Card parent node (card wrapper)
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = item.name;

    //Card child node - front - shows by default
    let front = document.createElement("div");
    front.classList.add("front");

    //Card child node - back - shows w/ image when card is selected for matched
    let back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = `url(${item.img})`;

    //Apply the card to the grid
    card.appendChild(front);
    card.appendChild(back);
    grid.appendChild(card);
  }

  //Listens for clicks on cards then initiate card flip fx
  grid.addEventListener("click", flipCard);
}

/*
flipCard function:
Checks if target selected is an eligible move in round
Updates total clicks 
Adds the 'selected' class to the target Element
Adds the card type to the selectedCards array for tracking
Determines if there is a match
Reset the cards' classes
*/

function flipCard(e) {
  let card = e.target;

  if (
    //Check if selected node was a 'div' (not a 'section' element which is the game container)
    card.nodeName === "DIV" &&
    //Check if target's parent node (which is the 'div' with 'card' class) has not been already selected or matched
    !card.parentNode.classList.contains("match") &&
    !card.parentNode.classList.contains("selected")
  ) {
    totalClicks++;
    score.innerText = `Best Score:${localStorage.bestScore} 
		Moves:${totalClicks}`;

    if (selectedCards.length < 2) {
      card.parentNode.classList.add("selected");
      selectedCards.push(card.parentNode.dataset.name);

      if (selectedCards.length === 2) {
        if (selectedCards[0] === selectedCards[1]) {
          setMatch();
          //setTimeout(resetSelected, delay);
        } else {
          setTimeout(resetSelected, 1000);
        }
      }
    }
  }
}

//Find all elements w/ 'selected' class and add a 'match' class
function setMatch() {
  matched += 2;
  var selected = document.querySelectorAll(".selected");
  selected.forEach(function(card) {
    card.classList.add("match");
  });

  if (matched === 16) {
    setTimeout(gameOver, 1000);
  }

  resetSelected();
}

//Remove all 'selected' classes on elements and resets the selectedCards array
function resetSelected() {
  selectedCards = [];
  var selected = document.querySelectorAll(".selected");
  selected.forEach(function(card) {
    card.classList.remove("selected");
  });
}

//hides the game board and displays the game over splash page replaces the best score
function gameOver() {
  if (localStorage.bestScore === "--" || totalClicks < localStorage.bestScore) {
    localStorage.bestScore = totalClicks;
  }

  document.querySelector("#splash_header").innerText = "Game Over";
  game.style.display = "none";
  splashScreen.style.display = "initial";

  endScore.display = "block";
  endScore.innerText = `Score:${totalClicks} 
	Best Score:${localStorage.bestScore}`;
}

/*
BUGS
-figure out why there are white lines that display where best score and moves are when we
transition to the game over splash page

-certain areas that you click on the board will cause all the cards' front image to look reversed,
but this does not affect the game. It reverses the image for less than a second.

*/
