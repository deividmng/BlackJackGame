let cards = [];
let hasBlackJack = false;
let isAlive = false;
let sum = 0;
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");

let player = {
  name: "David",
};

let chips = [200];  // Inicializar con 200 chips
let counterEl = document.getElementById("counter-el");
let counter = 60;  // Tiempo en segundos

// Incrementar chips cada minuto
setInterval(function() {
  chips[0] += 10;  // Incrementar chips en 10 cada minuto
  playerEl.textContent = player.name + ": £" + chips[0];
  counter = 60;  // Reiniciar el contador a 60 segundos
}, 60000);  // 60000 milisegundos = 1 minuto

// Actualizar el contador cada segundo
setInterval(function() {
  if (counter > 0) {
    counter--;  // Decrementar el contador
    counterEl.textContent = "Next chips in: " + counter + "s";
  }
}, 1000);  // 1000 milisegundos = 1 segundo

let playerEl = document.getElementById("player-el");
playerEl.textContent = player.name + ": £" + chips[0];

// Función para obtener una carta aleatoria
function getRandomCard() {
  let randomIndex = Math.floor(Math.random() * cardDeck.length);
  return cardDeck[randomIndex];
}

let betAmount = 0;  // Cantidad actual de la apuesta
let betSum = document.getElementById("betSum");

// function betFive() {
//   if (chips[0] >= 5) {
//     betAmount += 5;
//     chips[0] -= 5;
//     updateBetDisplay();
//   } else {
//     alert("Not enough chips to place this bet.");
//   }
// }

// function betTen() {
//   if (chips[0] >= 10) {
//     betAmount += 10;
//     chips[0] -= 10;
//     updateBetDisplay();
//   } else {
//     alert("Not enough chips to place this bet.");
//   }
// }



function bet(amount) {
  if (chips[0] >= amount) {
    betAmount += amount;
    chips[0] -= amount;
    updateBetDisplay();
  } else {
    alert("Not enough chips to place this bet.");
  }
}

function updateBetDisplay() {
  betSum.textContent = "Bet Sum: " + betAmount;
  playerEl.textContent = player.name + ": £" + chips[0];
}

function loseBet() {
  betAmount = 0;  // Resetear la apuesta
  updateBetDisplay();
}

function winBet() {
  chips[0] += betAmount * 2;  // Ganar las chips apostadas
  betAmount = 0;  // Resetear la apuesta
  updateBetDisplay();
}

let hasDrawnCard = false;  // Variable para rastrear si el jugador ha pedido una nueva carta

function startGame() {
  if (betAmount > 0) {
    isAlive = true;
    hasBlackJack = false;
    hasDrawnCard = false;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard.value + secondCard.value;

    let firstCardDealer = getRandomCard();
    dealerCards = [firstCardDealer];
    sumDealer = firstCardDealer.value;

    document.getElementById("doubleBet").style.display = "block";

    document.getElementById("bet-five-btn").disabled = true;
    document.getElementById("bet-ten-btn").disabled = true;

    renderGame();
    renderGameDealer();
  } else {
    alert("Please place a bet before starting the game.");
  }
}

function renderGame() {
  cardsEl.innerHTML = "Cards: ";
  for (let card of cards) {
    let img = document.createElement("img");
    img.src = card.image;
    img.style.width = "50px";
    img.style.height = "70px";
    cardsEl.appendChild(img);
  }
  sumEl.textContent = "Sum: " + sum;
  if (sum <= 20) {
    message = "Do You Want another card?";
  } else if (sum === 21) {
    message = "Blackjack!";
    hasBlackJack = true;
    isAlive = false;
    winBet();
    resetGameAfterDelay();
  } else if (sum > 21) {
    message = "You Bust! Dealer Wins!";
    isAlive = false;
    loseBet();
    resetGameAfterDelay();
  }
  messageEl.textContent = message;
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let card = getRandomCard();
    sum += card.value;
    cards.push(card);
    hasDrawnCard = true;
    document.getElementById("doubleBet").style.display = "none";
    renderGame();
    if (sum > 21) {
      message = "You Bust! Dealer Wins!";
      isAlive = false;
      loseBet();
      resetGameAfterDelay();
    }
  }
}

function dealerNewCard() {
  while (sumDealer < 17) {
    let card = getRandomCard();
    dealerCards.push(card);
    sumDealer += card.value;
  }
  renderGameDealer();  // Actualizar la visualización del dealer después de añadir una nueva carta
}

function doubleBet() {
  if (chips[0] >= betAmount && !hasDrawnCard) {  // Solo permitir doblar la apuesta si no se ha pedido una nueva carta
    chips[0] -= betAmount;
    betAmount *= 2;
    updateBetDisplay();

    // Pedir una nueva carta
    let card = getRandomCard();
    sum += card.value;
    cards.push(card);
    hasDrawnCard = true;  // Marcar que el jugador ha pedido una nueva carta
    document.getElementById("doubleBet").style.display = "none";  // Ocultar el botón de doblar apuesta
    renderGame();

    // Si la tercera carta se da al jugador, termina el juego
    if (sum > 21) {
      message = "You Bust! Dealer Wins!";
      isAlive = false;
      loseBet();  // Perder la apuesta si se pasa de 21
      resetGameAfterDelay();  // Reiniciar el juego después de 3 segundos
    }
  } else {
    alert("Not enough chips to double the bet or you've already drawn a new card.");
  }
  stand();
}

// Dealer logic
let dealerCards = [];
let cardDel = document.getElementById("cards-dele");
let messageDealer = document.getElementById("message-dele");
let playerDealer = document.getElementById("player-dele");

let sumDealer = 0;

function renderGameDealer() {
  cardDel.innerHTML = "Dealer's Cards: ";
  for (let card of dealerCards) {
    let img = document.createElement("img");
    img.src = card.image;
    img.style.width = "50px";
    img.style.height = "70px";
    cardDel.appendChild(img);
  }
  playerDealer.textContent = "Dealer's Sum: " + sumDealer;

  if (sumDealer > 21) {
    messageDealer.textContent = "Dealer Busted!";
  } else if (sumDealer === 21) {
    messageDealer.textContent = "Dealer got Blackjack!";
  } else {
    messageDealer.textContent = "Dealer stands.";
  }
}

function stand() {
  dealerNewCard();  // El dealer comienza a tomar cartas solo cuando el jugador decide "stand"

  // Determinar el ganador
  if (sumDealer > 21) {
    message = "Dealer Busted! You Win!";
    winBet();
  } else if (sum > sumDealer) {
    message = "You Busted! Dealer Win!";
    loseBet();
  } else if (sum < sumDealer) {
    message = "Dealer Wins!";
    loseBet();
  } else {
    message = "It's a tie!";
    chips[0] += betAmount; // Devolver la apuesta en caso de empate
  }

  messageEl.textContent = message;
  isAlive = false;
  resetGameAfterDelay();  // Reiniciar el juego después de 3 segundos
}

function resetGameAfterDelay() {
  setTimeout(function() {
    cards = [];
    dealerCards = [];
    sum = 0;
    sumDealer = 0;
    messageEl.textContent = "Want to play a round?";
    cardsEl.textContent = "Your Cards:";
    sumEl.textContent = "Your Sum:";
    cardDel.textContent = "Dealer's Cards:";
    playerDealer.textContent = "Dealer's Sum:";
    messageDealer.textContent = "Dealer's message will appear here";
    document.getElementById("doubleBet").style.display = "none";  // Ocultar el botón de doblar apuesta

    // Reactivar los botones de apuesta después de reiniciar el juego
    document.getElementById("bet-five-btn").disabled = false;
    document.getElementById("bet-ten-btn").disabled = false;
  }, 3000);
}

/// aqui es donde va a ir toda la funciones de las cartas 

const cardDeck = [
  { image: 'img/cartasPoker/card (1).png', value: 2 },
  { image: 'img/cartasPoker/card (2).png', value: 3 },
  { image: 'img/cartasPoker/card (3).png', value: 4 },
  { image: 'img/cartasPoker/card (4).png', value: 5 },
  { image: 'img/cartasPoker/card (5).png', value: 6 },
  { image: 'img/cartasPoker/card (6).png', value: 7 },
  { image: 'img/cartasPoker/card (7).png', value: 8 },
  { image: 'img/cartasPoker/card (8).png', value: 9 },
  { image: 'img/cartasPoker/card (9).png', value: 10 },
  { image: 'img/cartasPoker/card (10).png', value: 10 },
  { image: 'img/cartasPoker/card (11).png', value: 10 },
  { image: 'img/cartasPoker/card (12).png', value: 10 },
  { image: 'img/cartasPoker/card (13).png', value: 11 },
  // Repite para los otros palos: diamantes, corazones y espadas
];
