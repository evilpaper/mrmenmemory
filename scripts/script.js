const board = document.querySelector('.board');
const newGame = document.querySelector('.button-new-game');
const timerDisplay = document.querySelector('.time');
const punch = document.querySelector('.punch');
const zap = document.querySelector('.zap');
const bell = document.querySelector('.bell');
const whoosh = document.querySelector('.whoosh');
const vanish = document.querySelector('.vanish');
const hero = document.querySelector('.hero');
const cards = [{
    'name': 'mrwrong',
    'img': 'images/mrwrong.jpg',
  },
  {
    'name': 'mrtickle',
    'img': 'images/mrtickle.jpg',
  },
  {
    'name': 'mrstrong',
    'img': 'images/mrstrong.jpg',
  },
  {
    'name': 'mrimpossible',
    'img': 'images/mrimpossible.jpg',
  },
  {
    'name': 'mrhappy',
    'img': 'images/mrhappy.jpg',
  },
  {
    'name': 'mrchatterbox',
    'img': 'images/mrchatterbox.jpg',
  },
  {
    'name': 'mrbump',
    'img': 'images/mrbump.jpg'
  },
  {
    'name': 'mrbounce',
    'img': 'images/mrbounce.jpg',
  },
  {
    'name': 'lmwhoops',
    'img': 'images/lmwhoops.jpg',
  },
  {
    'name': 'lmnaughty',
    'img': 'images/lmnaughty.jpg',
  },
  {
    'name': 'lmhug',
    'img': 'images/lmhug.jpg',
  },
  {
    'name': 'lmfun',
    'img': 'images/lmfun.jpg',
  },
];

let firstGuess = '';
let secondGuess = '';
let previousGuess = null;
let cardCount = 0;
let matchesCount = 0;
let delay = 500;
let deck = cards.concat(cards);
let minutes = 0;
let seconds = 0;
let hundredths = 0;
// Create a handle for setInterval. setInterval sets up a recurring timer.
// It returns a handle that you can pass into clearInterval to stop it from firing.
let timer;

function updateTimer() {
    hundredths++;
    if (hundredths >= 99 ) {
      hundredths = 0;
      seconds++
    }
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    timerDisplay.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
      + ":" + (seconds > 9 ? seconds : "0" + seconds) + ":" + (hundredths > 9 ? hundredths : "0" + hundredths) ;
}

function startTimer() {
  bell.play();
  hero.play();
  timerDisplay.classList.remove('apply-bounce');
  timerDisplay.offsetWidth = timerDisplay.offsetWidth;
  timerDisplay.classList.add('apply-bounce');
  timer = setInterval(updateTimer, 10);
}

function stopTimer() {
  let finalTime = timerDisplay.textContent;
  clearInterval(timer);
  timerDisplay.textContent = finalTime;
}

function resetTimer() {
  seconds = 0; minutes = 0;
  clearInterval(timer);
  timerDisplay.textContent = "00:00:00";
}

function shuffleCards(deck) {
  return deck.sort(() => 0.5 - Math.random());
}

function dealCards() {
  deck.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.dataset.name = card.name;

    const cardFront = document.createElement('div');
    cardFront.classList.add('front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('back');
    cardBack.style.backgroundImage = `url(${card.img})`;

    board.appendChild(cardDiv);
    cardDiv.appendChild(cardFront);
    cardDiv.appendChild(cardBack);
  })
  bounceCards();
}

const removeCards = () => {
  deck.forEach(card => {
    let elToRemove = document.querySelector('.card')
    elToRemove.parentNode.removeChild(elToRemove);
  });
}

const removeMatches = () => {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(card => {
    card.classList.add('match');
    card.classList.add('poof');
    punch.play();
    vanish.play();
  });
}

const resetGuesses = () => {
  firstGuess = '';
  secondGuess = '';
  cardCount = 0;
  let selected = document.querySelectorAll('.selected');
  selected.forEach(card => {
    card.classList.remove('selected');
  });
}

const bounceCards = () => {
  let cards = document.querySelectorAll(".card");
  let deck = Array.apply(null, cards);
  deck.forEach(card => {
    card.classList.add('apply-bounce');
    card.style.animationDuration = Math.floor(Math.random() * 8 + 4)/10 + "s";
    card.addEventListener("animationend", (e) => {
      card.classList.remove("apply-bounce");
    });
  });
}

const initializeGame = () => {
  timerDisplay.textContent = "00:00:00";
  shuffleCards(deck)
  dealCards();
}

const updateGameState = (activeCard) => {
  // Do not allow the grid section itself to be selected or the same card twice, only div inside the grid
  if (
      activeCard.nodeName === 'SECTION' ||
      activeCard === previousGuess ||
      activeCard.parentNode.classList.contains('selected')
    ) {
    return;
  }
  if (cardCount < 2) {
    whoosh.play();
    cardCount++;
    if (cardCount === 1) {
      firstGuess = activeCard.parentNode.dataset.name;
      activeCard.parentNode.classList.add('selected');
      previousGuess = activeCard;
    } else {
      secondGuess = activeCard.parentNode.dataset.name;
      activeCard.parentNode.classList.add('selected');
      previousGuess = undefined;
    }
    // if both guesses are not empty...
    if (firstGuess !== '' && secondGuess !== '') {
      // and if first guess matches the second guess...
      if (firstGuess === secondGuess) {
        setTimeout(removeMatches, delay);
        setTimeout(resetGuesses, delay);
        matchesCount++;
        if (matchesCount === 12) {
          stopTimer();
        }
      } else {
        setTimeout(resetGuesses, delay);
      }
    }
  }
}

board.addEventListener('click', function(event) {
  event.preventDefault;
  const activeCard = event.target;

  if (timerDisplay.textContent === "00:00:00") {
    startTimer();
  }
  updateGameState(activeCard);
}, false)

newGame.addEventListener('click', function(event) {
  event.preventDefault;

  zap.play();
  hero.pause();
  hero.currentTime = 0;

  resetTimer();
  resetGuesses();
  removeCards();
  shuffleCards(deck)
  dealCards();

}, false)

initializeGame();
