(function () {
  const $ = (x) => document.querySelector(x);

  const LEADERBOARD_SERVICE_URL = "http://localhost:8080/alltime";
  const LASTWEEK_URL = "http://localhost:8080/alltime";
  const TODAY_URL = "http://localhost:8080/today";

  const board = $(".board");
  const leaderboardView = $(".leaderboard-overlay");
  const leaderboardBoard = $(".leaderboard__board");
  const leaderboardList = $(".leaderboard__list");

  let leaderboard = [];

  const finishGameViewAddToLeaderboard = $("#finish-game__one");
  const finishGameViewAddToLeaderboardTime = $("#finish-game__one--time");
  const addToLeaderboardForm = $("#add-to-leaderboard__form");

  const finishGameViewTryAgain = $("#finish-game__two");
  const finishGameViewTryAgainTime = $("#finish-game__two--time");
  const finishGameViewTryAgainCloseButton = $("#finish-game__two-button");

  const timerButton = $(".button-new-game");
  const leaderboardOpenButton = $(".button--open-leaderboard");
  const leaderboardCloseButton = $(".button--close-leaderboard");

  const timerDisplay = document.querySelector(".time");

  async function getLeaderboard() {
    const response = await fetch(LEADERBOARD_SERVICE_URL);
    return response.json();
  }

  async function postLeaderboardEntry(entryData) {
    const respone = await fetch(LEADERBOARD_SERVICE_URL, {
      method: "POST",
      body: JSON.stringify(entryData),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    return respone.json;
  }

  // Render leaderboard on first load.
  // Leaderboard is hidden from start so nothing will be visible.
  // But it's good to have it prepared.
  getLeaderboard()
    .then((result) => {
      renderLeaderboard(result);
      leaderboard = result;
    })
    .catch((error) => {
      console.log(error);
      renderFailedToFetch();
    });

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
  // Create a handle for setInterval. setInterval sets up a recurring timer.
  // It returns a handle that you can pass into clearInterval to stop it from firing.
  let timer;
  let addToLeaderboard = false;

  // Adjust view port height to account for mobile browser navigation
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  // Shuffle deck

  const shuffleCards = (deck) => {
    return deck.sort(() => 0.5 - Math.random());
  };

  // Prepare the playing deck

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

  const renderFailedToFetch = () => {
    leaderboardList.classList.add("failed-to-fetch");
    leaderboardList.innerHTML = `
      <div">
        <h1 class="failed-to-fetch">Ouch, couldn't load the leaderboard!</h1>
        <p class="failed-to-fetch">An email has been sent to Mr. Webmaster.</p>
        <p class="failed-to-fetch">Should be up and running again in no time.</p>
      </div>
    `;
  };

  const renderLeaderboard = (leaderboard) => {
    leaderboardList.classList.remove("failed-to-fetch");
    leaderboardList.innerHTML = "";

    for (let index = 0; index <= 9; index++) {
      const entry = leaderboard[index];
      const listItem = document.createElement("li");
      listItem.classList.add("leaderboard__list-item");
      listItem.innerHTML = createLeaderboardEntry(entry.name, entry.time);
      leaderboardList.appendChild(listItem);
    }
  };

  const createLeaderboardEntry = (name, time) => {
    const minutes = Math.floor(time / 60);
    const decimalSeconds = time % 60;
    const seconds = Math.floor(decimalSeconds);
    const hundredths = Math.floor(decimalSeconds * 100) % 100;

    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");
    const paddedHundredth = hundredths.toString().padStart(2, "0");

    return `
      <span class="list-item__name"><span>${name}</span></span>
      <span class="list-item__time">${paddedMinutes}:${paddedSeconds}:${paddedHundredth}</span>
    `;
  };

  const handleFinishGame = (finsihTimeInSeconds, finishTimeAsString) => {
    const timeNeededForLeaderboard = leaderboard[9]?.time;

    if (finsihTimeInSeconds < timeNeededForLeaderboard) {
      finishGameViewAddToLeaderboardTime.innerText = finishTimeAsString;
      addToLeaderboard = true;
      showFinishGameViewAddToLeaderboard();
    } else {
      finishGameViewTryAgainTime.innerText = finishTimeAsString;
      showFinishGameView();
    }
  };

  const showFinishGameViewAddToLeaderboard = () => {
    finishGameViewAddToLeaderboard.classList.remove("hidden");
    finishGameViewAddToLeaderboard.classList.add("bounce-in-top");
  };

  const showFinishGameView = () => {
    finishGameViewTryAgain.classList.remove("hidden");
    finishGameViewTryAgain.classList.add("bounce-in-top");
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
  };

  const bounceCards = () => {
    let cards = document.querySelectorAll(".card");
    let deck = Array.apply(null, cards);
    deck.forEach((card) => {
      card.classList.add("apply-bounce");
      card.style.animationDuration =
        Math.floor(Math.random() * 8 + 4) / 10 + "s";
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
            const finsihTimeInSeconds =
              minutes * 60 + seconds + hundredths / 100;
            const finishTimeAsString = timerDisplay.textContent;
            bell.play();
            backgroundSong.pause();
            backgroundSong.currentTime = 0;
            matchesCount = 0;
            setTimeout(() => {
              handleFinishGame(finsihTimeInSeconds, finishTimeAsString);
            }, 600);
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
    "touchstart",
    (event) => {
      event.preventDefault;
      if (isNotACard(event.target)) return;
      const activeCard = event.target;
      if (timerDisplay.textContent === "00:00:00") {
        startGame();
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
        startGame();
        // Get a fresh copy of the leaderboard
        getLeaderboard()
          .then((result) => {
            leaderboard = result;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      updateGameState(activeCard);
    },
    false
  );

  timerButton.addEventListener(
    "click",
    () => {
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
    getLeaderboard()
      .then((result) => {
        renderLeaderboard(result);
        leaderboard = result;
      })
      .catch((error) => {
        console.log(error);
        renderFailedToFetch();
      });
    this.classList.add("apply-push");
    leaderboardView.classList.remove("hidden");
    leaderboardBoard.classList.add("bounce-in-top");
  });

  leaderboardOpenButton.addEventListener("animationend", function (event) {
    this.classList.remove("apply-push");
  });

  leaderboardCloseButton.addEventListener("click", function (event) {
    this.classList.add("apply-push");
    leaderboardBoard.classList.add("slide-out-top");
  });

  leaderboardCloseButton.addEventListener("animationend", function (event) {
    this.classList.remove("apply-push");
  });

  leaderboardBoard.addEventListener("animationend", function (event) {
    if (leaderboardBoard.classList.contains("bounce-in-top")) {
      leaderboardBoard.classList.remove("bounce-in-top");
    }
    if (leaderboardBoard.classList.contains("slide-out-top")) {
      leaderboardBoard.classList.remove("slide-out-top");
      leaderboardView.classList.add("hidden");
      if (addToLeaderboard) {
        addToLeaderboard = false;
        setTimeout(() => {
          resetGame();
        }, 400);
      }
    }
  });

  leaderboardView.addEventListener("click", function (event) {
    if (event.target.classList.contains("option")) {
      const options = document.querySelectorAll(".option");

      options.forEach((item) => {
        item.classList.remove("option-selected");
      });

      event.target.classList.add("option-selected");
      // renderLeaderboard();
    }
    if (event.target.classList.contains("leaderboard-overlay")) {
      leaderboardBoard.classList.add("slide-out-top");
    }
  });

  finishGameViewTryAgain.addEventListener("animationend", function () {
    if (finishGameViewTryAgain.classList.contains("bounce-in-top")) {
      finishGameViewTryAgain.classList.remove("bounce-in-top");
    }
    if (finishGameViewTryAgain.classList.contains("slide-out-top")) {
      finishGameViewTryAgain.classList.remove("slide-out-top");
      finishGameViewTryAgain.classList.add("hidden");
      setTimeout(() => {
        resetGame();
      }, 400);
    }
  });

  finishGameViewTryAgainCloseButton.addEventListener("click", function (event) {
    event.preventDefault();
    finishGameViewTryAgainCloseButton.classList.add("apply-push");
    finishGameViewTryAgain.classList.add("slide-out-top");
  });

  finishGameViewTryAgain.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target.classList.contains("finished-game-overlay-two")) {
      finishGameViewTryAgain.classList.add("slide-out-top");
    }
  });

  addToLeaderboardForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const finalTime = minutes * 60 + seconds + hundredths / 100;
    const name = addToLeaderboardForm.elements["name"].value
      ? addToLeaderboardForm.elements["name"].value
      : "Mx. Anonymous";

    // WORK IN PROGRESS
    // Thinking about using time in seconds instead.
    // Both in database and front end.
    // Makes sorting and stuff easier.

    const playerName = name;
    const playerTime = finalTime;
    const playerDate = new Date().toISOString();
    const entryData = {
      name: playerName,
      time: playerTime,
      date: playerDate,
    };

    postLeaderboardEntry(entryData)
      .then((response) => {
        // updateUserInterface();
        console.log("Database updated");
        console.log("response: ", response);
      })
      .catch((error) => console.log(error));

    leaderboard.unshift(entryData);
    leaderboard.sort((a, b) => a.time - b.time);

    addToLeaderboardForm.elements["name"].value = " ";

    // Remove all local storage stuff
    // localStorage.setItem(
    //   "mr_men_memory_leaderboard",
    //   JSON.stringify(leaderboard)
    // );

    finishGameViewAddToLeaderboard.classList.add("slide-out-top");
  });

  finishGameViewAddToLeaderboard.addEventListener("animationend", function () {
    if (finishGameViewAddToLeaderboard.classList.contains("bounce-in-top")) {
      finishGameViewAddToLeaderboard.classList.remove("bounce-in-top");
    }
    if (finishGameViewAddToLeaderboard.classList.contains("slide-out-top")) {
      finishGameViewAddToLeaderboard.classList.remove("slide-out-top");
      finishGameViewAddToLeaderboard.classList.add("hidden");

      // Show leaderboard
      renderLeaderboard(leaderboard);
      leaderboardView.classList.remove("hidden");
      leaderboardBoard.classList.add("bounce-in-top");
    }
  });

  initializeGame();
})();
