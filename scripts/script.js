// todo
// add shake on reset button, like this https://tympanus.net/Development/CreativeButtons/
// make sure cards are always is a neat 6x4 or 4X6 grid and fit the viewport
// add a huggledy-piggledy mode
// add timer for solo play
// add two player game
// add "throw out animation" when cards are placed
// add "magnification animation" on small screens
// add a "poff" animation when you get a pair
// add highscore table



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
const newGame = document.querySelector('.button-new-game');
let firstGuess = '';
let secondGuess = '';
let previousGuess = null; // Used to not allow same item to be clicked twice
let cardCount = 0;
let delay = 700;
let deck = cards.concat(cards);



function placeOutCards() {
  deck.sort(() => 0.5 - Math.random());

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
  })
}

const removeMatches = () => {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(card => {
    card.classList.add('match');
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

// Add event listener to the grid
board.addEventListener('click', function(event) {
  // Grab the event target
  let clicked = event.target;

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

placeOutCards();

newGame.addEventListener('click', function(event) {
  removeCards();
  placeOutCards();
})
