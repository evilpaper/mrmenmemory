const board = document.querySelector(".board");
const newGame = document.querySelector(".button-new-game");
const timerDisplay = document.querySelector(".time");
const punch = document.querySelector(".punch");
const zap = document.querySelector(".zap");
const bell = document.querySelector(".bell");
const whoosh = document.querySelector(".whoosh");
const vanish = document.querySelector(".vanish");
const backgroundSong = document.querySelector(".background-song");
const body = document.querySelector("body");
const cards = [
  {
    name: "mrwrong",
    img: "images/mrwrong.jpg",
  },
  {
    name: "mrtickle",
    img: "images/mrtickle.jpg",
  },
  {
    name: "mrstrong",
    img: "images/mrstrong.jpg",
  },
  {
    name: "mrimpossible",
    img: "images/mrimpossible.jpg",
  },
  {
    name: "mrhappy",
    img: "images/mrhappy.jpg",
  },
  {
    name: "mrchatterbox",
    img: "images/mrchatterbox.jpg",
  },
  {
    name: "mrbump",
    img: "images/mrbump.jpg",
  },
  {
    name: "mrbounce",
    img: "images/mrbounce.jpg",
  },
  {
    name: "lmwhoops",
    img: "images/lmwhoops.jpg",
  },
  {
    name: "lmnaughty",
    img: "images/lmnaughty.jpg",
  },
  {
    name: "lmhug",
    img: "images/lmhug.jpg",
  },
  {
    name: "lmfun",
    img: "images/lmfun.jpg",
  },
];

let firstGuess = "";
let secondGuess = "";
let previousGuess = null;
let activeCards = 0;
let matchesCount = 0;
let delay = 500;
let deck = cards.concat(cards); // Two of each card
let minutes = 0;
let seconds = 0;
let hundredths = 0;
let timer; // Create a handle for setInterval. setInterval sets up a recurring timer. It returns a handle that you can pass into clearInterval to stop it from firing.
let bestOfBoard = [];

const updateTimer = () => {
  hundredths++;
  if (hundredths >= 99) {
    hundredths = 0;
    seconds++;
  }
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  timerDisplay.textContent =
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds) +
    ":" +
    (hundredths > 9 ? hundredths : "0" + hundredths);
};

const applyBounce = (element) => {
  element.classList.remove("apply-bounce");
  element.offsetWidth = timerDisplay.offsetWidth;
  element.classList.add("apply-bounce");
};

const startTimer = () => {
  bell.play();
  backgroundSong.play();
  applyBounce(timerDisplay);
  timer = setInterval(updateTimer, 10);
};

const stopTimer = () => {
  let finalTime = timerDisplay.textContent;
  const leaderboardEntry = {
    player: "anonymous",
    date: new Date(),
    time: finalTime,
  };
  localStorage.setItem("leaderboardEntry", JSON.stringify(leaderboardEntry));
  bestOfBoard.push(finalTime);
  console.log(bestOfBoard.sort());
  clearInterval(timer);
  timerDisplay.textContent = finalTime;
  bell.play();
  backgroundSong.pause();
  backgroundSong.currentTime = 0;
  applyBounce(timerDisplay);
};

const resetTimer = () => {
  seconds = 0;
  minutes = 0;
  clearInterval(timer);
  timerDisplay.textContent = "00:00:00";
};

const shuffleCards = (deck) => {
  return deck.sort(() => 0.5 - Math.random());
};

const dealCards = () => {
  deck.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.dataset.name = card.name;

    const cardFront = document.createElement("div");
    cardFront.classList.add("front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("back");
    cardBack.style.backgroundImage = `url(${card.img})`;

    board.appendChild(cardDiv);
    cardDiv.appendChild(cardFront);
    cardDiv.appendChild(cardBack);
  });
};

const removeCards = () => {
  deck.forEach((card) => {
    let elToRemove = document.querySelector(".card");
    elToRemove.parentNode.removeChild(elToRemove);
  });
};

const removeMatches = () => {
  const selected = document.querySelectorAll(".selected");
  selected.forEach((card) => {
    card.classList.add("match");
    card.classList.add("poof");
    punch.play();
    vanish.play();
  });
};

const resetGuesses = () => {
  firstGuess = "";
  secondGuess = "";
  activeCards = 0;
  let selected = document.querySelectorAll(".selected");
  selected.forEach((card) => {
    card.classList.remove("selected");
  });
};

const bounceCards = () => {
  let cards = document.querySelectorAll(".card");
  let deck = Array.apply(null, cards);
  deck.forEach((card) => {
    card.classList.add("apply-bounce");
    card.style.animationDuration = Math.floor(Math.random() * 8 + 4) / 10 + "s";
    card.addEventListener("animationend", (e) => {
      card.classList.remove("apply-bounce");
    });
  });
};

const initializeGame = () => {
  resetTimer();
  shuffleCards(deck);
  dealCards();
};

const writeBestTime = () => {
  const leaderboardList = document.createElement("ul");
  leaderboardList.textContent = "Congrats! Your time";
  body.appendChild(leaderboardList);
  bestOfBoard.forEach((time) => {
    const leaderboardListItem = document.createElement("li");
    leaderboardListItem.textContent = time;
    leaderboardList.appendChild(leaderboardListItem);
  });
};

const flipUp = (card) => {
  card.parentNode.classList.add("selected");
};

const flipBack = (card) => {};

const resetGame = () => {
  stopTimer();
  matchesCount = 0;
  removeCards();
  writeBestTime();
};

const updateGameState = (activeCard) => {
  if (activeCards < 2) {
    whoosh.play();
    activeCards++;
    if (activeCards === 1) {
      firstGuess = activeCard.parentNode.dataset.name;
      flipUp(activeCard);
      // activeCard.parentNode.classList.add("selected");
      previousGuess = activeCard;
    } else {
      secondGuess = activeCard.parentNode.dataset.name;
      activeCard.parentNode.classList.add("selected");
      previousGuess = undefined;
    }
    // if both guesses are not empty...
    if (firstGuess !== "" && secondGuess !== "") {
      // and if first guess matches the second guess...
      if (firstGuess === secondGuess) {
        setTimeout(removeMatches, delay);
        setTimeout(resetGuesses, delay);
        matchesCount++;
        if (matchesCount === 12) {
          stopTimer();
          matchesCount = 0;
          removeCards();
          writeBestTime();
        }
      } else {
        setTimeout(resetGuesses, delay);
      }
    }
  }
};

const isNotACard = (thing) => {
  return (
    thing.nodeName === "SECTION" ||
    thing === previousGuess ||
    thing.parentNode.classList.contains("selected") ||
    thing.parentNode.classList.contains("match")
  );
};

board.addEventListener(
  "click",
  (event) => {
    event.preventDefault;
    if (isNotACard(event.target)) return;
    const activeCard = event.target;
    if (timerDisplay.textContent === "00:00:00") {
      startTimer();
    }
    updateGameState(activeCard);
  },
  false
);

newGame.addEventListener(
  "click",
  (event) => {
    event.preventDefault;

    zap.play();
    backgroundSong.pause();
    backgroundSong.currentTime = 0;
    newGame.classList.add("apply-push");

    resetTimer();
    resetGuesses();
    removeCards();
    // removeBestTimes();
    shuffleCards(deck);
    dealCards();

    if (newGame.innerText === "START") {
      newGame.innerText = "RESET";
      startTimer();
    } else {
      newGame.innerText = "START";
      bounceCards();
    }
  },
  false
);

newGame.addEventListener("animationend", function (event) {
  this.classList.remove("bounce-in-top");
  this.classList.remove("apply-push");
});

initializeGame();
