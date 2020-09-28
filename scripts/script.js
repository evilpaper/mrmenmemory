const board = document.querySelector(".board");
const leaderboardPage = document.querySelector(".leaderboard-page");
const timerButton = document.querySelector(".button-new-game");
const leaderboardOpenButton = document.querySelector(
  ".button--open-leaderboard"
);
const leaderboardCloseButton = document.querySelector(
  ".button--close-leaderboard"
);
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

  const oldLeaderboard = localStorage.getItem(
    "Mr Men Memory Match Local Leaderboard"
  );

  console.log(JSON.parse(oldLeaderboard));

  const leaderboardEntry = {
    player: "anonymous",
    date: new Date(),
    time: finalTime,
  };

  localStorage.setItem(
    "Mr Men Memory Match Local Leaderboard",
    JSON.stringify(leaderboardEntry)
  );

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
  if (document.querySelectorAll(".card").length > 0) {
    deck.forEach((card) => {
      let elToRemove = document.querySelector(".card");
      elToRemove.parentNode.removeChild(elToRemove);
    });
  }
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

const writeBestTime = () => {};

const flipUp = (card) => {
  card.parentNode.classList.add("selected");
};

const flipBack = (card) => {};

// For development purposes only
const completeGame = () => {
  stopTimer();
  matchesCount = 0;
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
          // completeGame();
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
      timerButton.innerText = "RESET";
    }
    updateGameState(activeCard);
  },
  false
);

timerButton.addEventListener(
  "click",
  (event) => {
    event.preventDefault;

    zap.play();
    backgroundSong.pause();
    backgroundSong.currentTime = 0;
    timerButton.classList.add("apply-push");

    resetTimer();
    resetGuesses();
    removeCards();
    shuffleCards(deck);
    dealCards();

    if (timerButton.innerText === "START") {
      timerButton.innerText = "RESET";
      startTimer();
    } else {
      timerButton.innerText = "START";
      bounceCards();
    }
  },
  false
);

timerButton.addEventListener("animationend", function (event) {
  this.classList.remove("bounce-in-top");
  this.classList.remove("apply-push");
});

leaderboardOpenButton.addEventListener("click", function (event) {
  leaderboardPage.classList.remove("hidden");
});

leaderboardCloseButton.addEventListener("click", function () {
  leaderboardPage.classList.add("hidden");
});

initializeGame();
