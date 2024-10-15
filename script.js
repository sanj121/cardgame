let cards = [
  'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
  'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

let soundOn = true;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Clear the board before creating it
  const shuffledCards = shuffle(cards.slice());
  shuffledCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.card = card;
      
      const img = document.createElement('img');
      img.src = `images/${card}.jpg`;
      img.alt = card;
      cardElement.appendChild(img);
      
      cardElement.addEventListener('click', flipCard);
      gameBoard.appendChild(cardElement);
  });
}

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let time = 0;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
      time++;
      document.getElementById('timer').textContent = time;
  }, 1500);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  time = 0;
  document.getElementById('timer').textContent = time;
}

function updateMoves() {
  moves++;
  document.getElementById('score').textContent = moves;
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (soundOn) document.getElementById('flip-sound').play(); // Play flip sound

  this.classList.add('flipped');
  
  if (!firstCard) {
      firstCard = this;
      return;
  }

  secondCard = this;
  updateMoves(); // Increment move count here
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;
  if (isMatch) {
      if (soundOn) document.getElementById('match-sound').play(); // Play match sound
      disableCards();
  } else {
      if (soundOn) document.getElementById('mismatch-sound').play(); // Play mismatch sound
      unflipCards();
  }
  if (document.querySelectorAll('.card.matched').length === cards.length) {
      stopTimer();
      setTimeout(() => {
          alert('Congratulations! You have matched all the cards.');
          saveHighScore();
      }, 500);
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

document.getElementById('restart-button').addEventListener('click', () => {
  resetTimer();
  resetMoves();
  resetBoard();
  createBoard();
  startTimer();
});

function resetMoves() {
  moves = 0;
  document.getElementById('score').textContent = moves;
}

document.getElementById('difficulty').addEventListener('change', (event) => {
  const difficulty = event.target.value;
  if (difficulty === 'easy') {
      cards = ['A', 'A', 'B', 'B'];
  } else if (difficulty === 'medium') {
      cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
  } else if (difficulty === 'hard') {
      cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
  }
  resetTimer();
  resetMoves();
  resetBoard();
  createBoard();
  startTimer();
});

document.addEventListener('DOMContentLoaded', () => {
  createBoard();
  startTimer();
  loadHighScore();
});

function saveHighScore() {
  const difficulty = document.getElementById('difficulty').value;
  const bestScoreKey = `${difficulty}-bestScore`;
  const bestTimeKey = `${difficulty}-bestTime`;

  const currentBestScore = localStorage.getItem(bestScoreKey);
  const currentBestTime = localStorage.getItem(bestTimeKey);

  if (currentBestScore === null || moves < currentBestScore) {
      localStorage.setItem(bestScoreKey, moves);
      localStorage.setItem(bestTimeKey, time);
      alert(`New High Score! Moves: ${moves}, Time: ${time} seconds`);
      updateLeaderboard(difficulty);
  } else if (moves === currentBestScore && time < currentBestTime) {
      localStorage.setItem(bestTimeKey, time);
      alert(`New Best Time! Moves: ${moves}, Time: ${time} seconds`);
      updateLeaderboard(difficulty);
  }
}

function loadHighScore() {
  const difficulty = document.getElementById('difficulty').value;
  const bestScoreKey = `${difficulty}-bestScore`;
  const bestTimeKey = `${difficulty}-bestTime`;

  const bestScore = localStorage.getItem(bestScoreKey);
  const bestTime = localStorage.getItem(bestTimeKey);

  if (bestScore !== null && bestTime !== null) {
      alert(`Best Score for ${difficulty}: ${bestScore} moves, ${bestTime} seconds`);
  }
  updateLeaderboard(difficulty);
}

function updateLeaderboard(difficulty) {
  const bestScoreKey = `${difficulty}-bestScore`;
  const bestTimeKey = `${difficulty}-bestTime`;

  const bestScore = localStorage.getItem(bestScoreKey);
  const bestTime = localStorage.getItem(bestTimeKey);

  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = '';

  if (bestScore !== null && bestTime !== null) {
      const listItem = document.createElement('li');
      listItem.textContent = `Difficulty: ${difficulty}, Moves: ${bestScore}, Time: ${bestTime} seconds`;
      leaderboardList.appendChild(listItem);
  }
}

document.getElementById('toggle-sound-button').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('toggle-sound-button').textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
});
