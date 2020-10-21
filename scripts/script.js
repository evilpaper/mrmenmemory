// TODO
// Reset game after showing leaderboard if player was added
// Show only congratulations if player don't make is to the leaderboard
// addEntryToLeaderboard
// updateLocalStorage

const board = document.querySelector(".board");
const leaderboardView = document.querySelector(".leaderboard-overlay");
const leaderboardBoard = document.querySelector(".leaderboard__board");
const leaderboardList = document.querySelector(".leaderboard__list");
const finishGameView = document.querySelector(".finished-game-overlay");
const finishGameMessage = document.querySelector(".finish-game-modal__message")
const finishGameTime = document.querySelector(".finish-message__time");
const playerNameInput = document.querySelector(
  ".finish-message__player-name-input"
);
const finishGameViewCloseButton = document.querySelector(
  ".button--close-finish-game"
);
const timerButton = document.querySelector(".button-new-game");
const leaderboardOpenButton = document.querySelector(
  ".button--open-leaderboard"
);
const leaderboardCloseButton = document.querySelector(
  ".button--close-leaderboard"
);

const timerDisplay = document.querySelector(".time");

const leaderboard = localStorage.getItem("mr_men_memory_leaderboard")
  ? JSON.parse(localStorage.getItem("mr_men_memory_leaderboard"))
  : STARTING_LEADERBOARD;

const punch = document.querySelector(".punch");
const zap = document.querySelector(".zap");
const bell = document.querySelector(".bell");
const whoosh = document.querySelector(".whoosh");
const vanish = document.querySelector(".vanish");
const backgroundSong = document.querySelector(".background-song");
const body = document.querySelector("body");

let firstGuess = "";
let secondGuess = "";
let previousGuess = null;
let activeCards = 0;
let matchesCount = 0;
let delay = 500;
let minutes = 0;
let seconds = 0;
let hundredths = 0;
let timer; // Create a handle for setInterval. setInterval sets up a recurring timer. It returns a handle that you can pass into clearInterval to stop it from firing.

const shuffleCards = (deck) => {
  return deck.sort(() => 0.5 - Math.random());
};

let playdeck = shuffleCards(cards).slice(0, 8);
let deck = playdeck.concat(playdeck); // Two of each card

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
  clearInterval(timer);
  timerDisplay.textContent = finalTime;
  bell.play();
  backgroundSong.pause();
  backgroundSong.currentTime = 0;
  applyBounce(timerDisplay);
};

const populateLeaderboard = () => {
  leaderboardList.innerHTML = "";
  for (let index = 0; index <= 9; index++) {
    const entry = leaderboard[index];
    const listItem = document.createElement("li");
    listItem.classList.add("leaderboard__list-item");
    listItem.innerHTML = createLeaderboardEntry(entry.name, entry.display);
    leaderboardList.appendChild(listItem);
  }
};

const createLeaderboardEntry = (name, time) => {
  return `
      <span class="list-item__name">${name}</span>
      <span class="list-item__time">${time}</span>
  `;
};

const updateFinishGameView = () => {
  finishGameTime.innerHTML = `${timerDisplay.textContent}`;
  // finishGameMessage.innerHTML = `<input class="finish-message__player-name-input"/>
  // <p class="finish-message__copy">Congratulations! Type your nickname and press <span class="finish-message__strong">ENTER</span> to submit you time.</p>`
}

const showFinishGameView  = () => {
  finishGameView.classList.remove("hidden");
  finishGameView.classList.add("bounce-in-top");
};

const resetTimer = () => {
  seconds = 0;
  minutes = 0;
  clearInterval(timer);
  timerDisplay.textContent = "00:00:00";
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

const resetGame = () => {
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

const flipUp = (card) => {
  card.parentNode.classList.add("selected");
};

const flipBack = (card) => {};

const completeGame = () => {
  stopTimer();
  bell.play();
  backgroundSong.pause();
  backgroundSong.currentTime = 0;
  updateFinishGameView();
  showFinishGameView ();
};

const updateGameState = (activeCard) => {
  if (activeCards < 2) {
    whoosh.play();
    activeCards++;
    if (activeCards === 1) {
      firstGuess = activeCard.parentNode.dataset.name;
      flipUp(activeCard);

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
        if (matchesCount === 8) {
          // completeGame();
          stopTimer();
          bell.play();
          backgroundSong.pause();
          backgroundSong.currentTime = 0;
          updateFinishGameView();
          showFinishGameView ();
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

populateLeaderboard();

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
    resetGame();
    // event.preventDefault;

    // zap.play();
    // backgroundSong.pause();
    // backgroundSong.currentTime = 0;
    // timerButton.classList.add("apply-push");

    // resetTimer();
    // resetGuesses();
    // removeCards();
    // shuffleCards(deck);
    // dealCards();

    // if (timerButton.innerText === "START") {
    //   timerButton.innerText = "RESET";
    //   startTimer();
    // } else {
    //   timerButton.innerText = "START";
    //   bounceCards();
    // }
  },
  false
);

timerButton.addEventListener("animationend", function (event) {
  this.classList.remove("bounce-in-top");
  this.classList.remove("apply-push");
});

leaderboardOpenButton.addEventListener("click", function (event) {
  populateLeaderboard();
  leaderboardView.classList.remove("hidden");
  leaderboardBoard.classList.add("bounce-in-top");
});

leaderboardBoard.addEventListener("animationend", function (event) {
  if (leaderboardBoard.classList.contains("bounce-in-top")) {
    leaderboardBoard.classList.remove("bounce-in-top");
  }
  if (leaderboardBoard.classList.contains("slide-out-top")) {
    leaderboardBoard.classList.remove("slide-out-top");
    leaderboardView.classList.add("hidden");
  }
});

leaderboardCloseButton.addEventListener("click", function (event) {
  leaderboardBoard.classList.add("slide-out-top");
});

leaderboardView.addEventListener("click", function (event) {
  if (event.target.classList.contains("leaderboard-overlay")) {
    leaderboardBoard.classList.add("slide-out-top");
  }
});

finishGameView.addEventListener("animationend", function (event) {
  if (finishGameView.classList.contains("bounce-in-top")) {
    finishGameView.classList.remove("bounce-in-top");
  }
  if (finishGameView.classList.contains("slide-out-top")) {
    finishGameView.classList.remove("slide-out-top");
    finishGameView.classList.add("hidden");
    resetGame();
  }
});

function addAnonymousToLeaderboard() {
  const finalTime = minutes * 60 + seconds + hundredths / 100;

  const newEntry = {
    name: "Mx. Anonymous",
    time: finalTime,
    display: timerDisplay.textContent,
  };
  leaderboard.unshift(newEntry);

  leaderboard.sort((a, b) => a.time - b.time);

  localStorage.setItem(
    "mr_men_memory_leaderboard",
    JSON.stringify(leaderboard)
  );
}

finishGameViewCloseButton.addEventListener("click", (event) => {
  event.preventDefault();
  finishGameViewCloseButton.classList.add("apply-push");
  addAnonymousToLeaderboard();
  finishGameView.classList.add("slide-out-top");
});

finishGameView.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("finished-game-overlay")) {
    addAnonymousToLeaderboard();
    finishGameView.classList.add("slide-out-top");
  }
});

playerNameInput.addEventListener("change", (event) => {
  const finalTime = minutes * 60 + seconds + hundredths / 100;

  const newEntry = {
    name: event.target.value,
    time: finalTime,
    display: timerDisplay.textContent,
  };
  leaderboard.unshift(newEntry);

  leaderboard.sort((a, b) => a.time - b.time);

  localStorage.setItem(
    "mr_men_memory_leaderboard",
    JSON.stringify(leaderboard)
  );

  finishGameView.classList.add("hidden");
  setTimeout(() => {
    populateLeaderboard();
    leaderboardView.classList.remove("hidden");
    leaderboardBoard.classList.add("bounce-in-top");
  }, 100);
});

initializeGame();
