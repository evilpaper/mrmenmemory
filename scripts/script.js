(function(){

  const $ = (x) => document.querySelector(x)

  const board = $(".board");
  const leaderboardView = $(".leaderboard-overlay");
  const leaderboardBoard = $(".leaderboard__board");
  const leaderboardList = $(".leaderboard__list");
  const finishGameView = $(".finished-game-overlay");
  const finishGameCopy = $(".finish-message__copy");
  const finishGameTime = $(".finish-message__time");
  const playerNameInput = $(".finish-message__player-name-input");
  const finishGameViewCloseButton = $(".button--close-finish-game");
  const timerButton = $(".button-new-game");
  const leaderboardOpenButton = $(".button--open-leaderboard");
  const leaderboardCloseButton = $(".button--close-leaderboard");
  
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
  
  // Asjust view port height to account for mobile browser navigation
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

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
    const finalTime = minutes * 60 + seconds + hundredths / 100;
    const timeNeededForLeaderboard = leaderboard[9].time;
    playerNameInput.value = "";
    playerNameInput.innerHTML = "";
    finishGameTime.innerHTML = `${timerDisplay.textContent}`;
    if (finalTime < timeNeededForLeaderboard ) {
      playerNameInput.classList.remove("hidden")
      finishGameCopy.innerHTML = `Congratulations! Type your <span class="finish-message__strong">nickname</span> to get your name on the leaderboard.`
    } else {
      finishGameCopy.innerHTML = `Well done. Keep trying to reach the leaderboard.`
    }
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
  
    bell.pause();
    bell.currentTime = 0;
  
    matchesCount = 0;
  
    resetTimer();
    resetGuesses();
    removeCards();
    shuffleCards(deck);
    dealCards();
    bounceCards();
  
    timerButton.innerText = "START";
  };
  
  const startGame = () => {
    startTimer();
    bell.play();
    timerButton.innerText = "RESET";
  }
  
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
    // const time = minutes * 60 + seconds + hundredths / 100;
    bell.play();
    backgroundSong.pause();
    backgroundSong.currentTime = 0;
    matchesCount=0;
    setTimeout(()=> {
      updateFinishGameView();
      showFinishGameView ()
    }, 600)
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
          setTimeout(removeMatches, 300);
          setTimeout(resetGuesses, 300);
          matchesCount++;
          if (matchesCount >= 8) {
            // completeGame();
            stopTimer();
            // const time = minutes * 60 + seconds + hundredths / 100;
            bell.play();
            backgroundSong.pause();
            backgroundSong.currentTime = 0;
            matchesCount=0;
            setTimeout(()=> {
              updateFinishGameView();
              showFinishGameView ()
            }, 600)
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
  
  board.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault;
      if (isNotACard(event.target)) return;
      const activeCard = event.target;
      if (timerDisplay.textContent === "00:00:00") {
        startGame()
      }
      updateGameState(activeCard);
    },
    false
  );
  
  board.addEventListener(
    "click",
    (event) => {
      event.preventDefault;
      if (isNotACard(event.target)) return;
      const activeCard = event.target;
      if (timerDisplay.textContent === "00:00:00") {
        startGame()
      }
      updateGameState(activeCard);
    },
    false
  );
  
  timerButton.addEventListener(
    "click",
    (event) => {
  
      timerButton.classList.add("apply-push");
  
      if (timerButton.innerText === "START") {
        startGame();
      } else if (timerButton.innerText === "RESET") {
        resetGame();
      }
    },
    false
  );
  
  timerButton.addEventListener("animationend", function (event) {
    this.classList.remove("bounce-in-top");
    this.classList.remove("apply-push");
  });
  
  leaderboardOpenButton.addEventListener("click", function (event) {
    this.classList.add("apply-push");
    populateLeaderboard();
    leaderboardView.classList.remove("hidden");
    leaderboardBoard.classList.add("bounce-in-top");
  });
  
  leaderboardOpenButton.addEventListener("animationend", function(event) {
    this.classList.remove("apply-push");
  })
  
  leaderboardCloseButton.addEventListener("click", function (event) {
    this.classList.add("apply-push");
    leaderboardBoard.classList.add("slide-out-top");
  });
  
  leaderboardCloseButton.addEventListener("animationend", function (event) {
    this.classList.remove("apply-push");
  })
  
  leaderboardBoard.addEventListener("animationend", function (event) {
    if (leaderboardBoard.classList.contains("bounce-in-top")) {
      leaderboardBoard.classList.remove("bounce-in-top");
    }
    if (leaderboardBoard.classList.contains("slide-out-top")) {
      leaderboardBoard.classList.remove("slide-out-top");
      leaderboardView.classList.add("hidden");
      if (!playerNameInput.classList.contains("hidden")) {
        playerNameInput.classList.add("hidden");
        resetGame();
      }
    }
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
      if (playerNameInput.classList.contains("hidden")) {
        resetGame();
      }
    }
  });
  
  finishGameViewCloseButton.addEventListener("click", (event) => {
    event.preventDefault();
    finishGameViewCloseButton.classList.add("apply-push");
    finishGameView.classList.add("slide-out-top");
    addAnonymousToLeaderboard();
  });
  
  finishGameView.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("finished-game-overlay")) {
      finishGameView.classList.add("slide-out-top");
      addAnonymousToLeaderboard();
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
  
})();

