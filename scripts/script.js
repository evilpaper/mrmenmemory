// todo
// cascade the reset shake (make each card shake a different period)
// add a huggledy-piggledy mode
// steal timer behaviour, incl. animations, from Santa Tracker
// add sounds like Santa Tracker
// add animations like the pro's from awwwards
// remove animation class on tranistion end like this https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/

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
const board = document.querySelector('.board');
const newGameButton = document.querySelector('.button-new-game');
const timeDisplay = document.querySelector('.time');
const pop = document.querySelector('.pop');

let firstGuess = '';
let secondGuess = '';
let previousGuess = null; // Used to not allow same item to be clicked twice
let cardCount = 0;
let delay = 500;
let deck = cards.concat(cards);
let minutes = 0;
let seconds = 0;
let timerOn = false;
let gameOn = false;

/*
Create a handle for setInterval. setInterval sets up a recurring timer. It returns a handle that you can pass
into clearInterval to stop it from firing:
*/
let timer;

function updateTimer() {
  if (timerOn) {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    timeDisplay.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
      + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }
}

function startTimer() {
  timerOn = true;
  timer = setInterval(updateTimer, 1000);
  timeDisplay.classList.remove('bounce-top');
  timeDisplay.offsetWidth = timeDisplay.offsetWidth;
  timeDisplay.classList.add('bounce-top');
}

function stopTimer() {
  timerOn = false;
}

function resetTimer() {
  timerOn = false;
  seconds = 0; minutes = 0;
  clearInterval(timer);
  timeDisplay.textContent = "00:00";
}

function resetGame() {
  return gameOn = false;
}

function shuffleCards() {
  deck.sort(() => 0.5 - Math.random());
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
    pop.play();
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

board.addEventListener('click', function(event) {
  // Grab the event target
  let clicked = event.target;

  if (gameOn === false) {
    gameOn = true;
    startTimer();
  }

  // Do not allow the grid section itself to be selected or the same card twice, only div inside the grid
  if (
      clicked.nodeName === 'SECTION' ||
      clicked === previousGuess ||
      clicked.parentNode.classList.contains('selected')
    ) {
    return;
  }
  if (cardCount < 2) {
    cardCount++;
    if (cardCount === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    }
    // if both guesses are not empty...
    if (firstGuess !== '' && secondGuess !== '') {
      // and if first guess matches the second guess...
      if (firstGuess === secondGuess) {
        setTimeout(removeMatches, delay);
        setTimeout(resetGuesses, delay);
      } else {
        setTimeout(resetGuesses, delay);
      }
    }
    previousGuess = clicked;
  }
})

shuffleCards()
dealCards();

newGameButton.addEventListener('click', function(event) {
  event.preventDefault;
  console.log("New Game clicked!");
  /*
  board.classList.remove('bounce-top');
  board.offsetWidth = newGameButton.offsetWidth;
  board.classList.add("bounce-top");
  */
  let cards = document.querySelectorAll(".card");
  console.log(cards)
  cards.forEach(card => {
    console.log(card);
  });
  /*
  deck.forEach(card => {
    console.log(card);
    card.style.animation = "bounce-top 0.4s both";
  });
  */
  board.classList.remove('bounce-top');
  board.offsetWidth = newGameButton.offsetWidth;
  board.classList.add('bounce-top');
  resetGame();
  resetTimer();
  removeCards();
  shuffleCards()
  dealCards();
  ;
}, false)
