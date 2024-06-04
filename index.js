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

function getRandonCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  if (randomNumber > 10) {
    return 10;
  } else if (randomNumber === 1) {
    return 11;
  } else {
    return randomNumber;
  }
}

let betAmount = 0;  // Cantidad actual de la apuesta
let betSum = document.getElementById("betSum");

function betFive() {
  if (chips[0] >= 5) {
    betAmount += 5;
    chips[0] -= 5;
    updateBetDisplay();
  } else {
    alert("Not enough chips to place this bet.");
  }
}

function betTen() {
  if (chips[0] >= 10) {
    betAmount += 10;
    chips[0] -= 10;
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

// Restricción de apuestas adicionales después de la apuesta inicial
function startGame() {
  if (betAmount > 0) {  // Verificar si se ha realizado una apuesta
    isAlive = true;
    hasBlackJack = false;
    hasDrawnCard = false;  // Reiniciar la variable de control al iniciar el juego
    let firstCard = getRandonCard();
    let secondCard = getRandonCard();
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;

    // Dealer cards
    let firstCardDealer = getRandonCard();
    dealerCards = [firstCardDealer];
    sumDealer = firstCardDealer;

    document.getElementById("doubleBet").style.display = "block";  // Mostrar el botón de doblar apuesta

    // Desactivar los botones de apuesta adicional
    document.getElementById("bet-five-btn").disabled = true;
    document.getElementById("bet-ten-btn").disabled = true;

    renderGame();
    renderGameDealer();
  } else {
    alert("Please place a bet before starting the game.");
  }
}

function renderGame() {
  cardsEl.textContent = "Cards: " + cards.join(" ");
  sumEl.textContent = "Sum: " + sum;
  if (sum <= 20) {
    message = "Do You Want another card?";
  } else if (sum === 21) {
    message = "Blackjack!";
    hasBlackJack = true;
    isAlive = false;
    winBet();  // Ganar la apuesta si se obtiene un Blackjack
    resetGameAfterDelay();  // Reiniciar el juego después de 3 segundos
  } else if (sum > 21) {  // Si el jugador se pasa de 21, el dealer gana automáticamente
    message = "You Bust! Dealer Wins!";
    isAlive = false;
    loseBet();  // Perder la apuesta si se pierde
    resetGameAfterDelay();  // Reiniciar el juego después de 3 segundos
  }
  messageEl.textContent = message;
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let card = getRandonCard();
    sum += card;
    cards.push(card);
    hasDrawnCard = true;  // Marcar que el jugador ha pedido una nueva carta
    document.getElementById("doubleBet").style.display = "none";  // Ocultar el botón de doblar apuesta
    renderGame();
    if (sum > 21) {
      message = "You Bust! Dealer Wins!";
      isAlive = false;
      loseBet();  // Perder la apuesta si se pasa de 21
      resetGameAfterDelay();  // Reiniciar el juego después de 3 segundos
    }
  }
}

function dealerNewCard() {
  while (sumDealer < 17) {
    let card = getRandonCard();
    dealerCards.push(card);
    sumDealer += card;
  }
  renderGameDealer();  // Actualizar la visualización del dealer después de añadir una nueva carta
}

function doubleBet() {
  stand()
  if (chips[0] >= betAmount && !hasDrawnCard) {  // Solo permitir doblar la apuesta si no se ha pedido una nueva carta
    chips[0] -= betAmount;
    betAmount *= 2;
    updateBetDisplay();

    // Pedir una nueva carta
    let card = getRandonCard();
    sum += card;
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
}

// Dealer logic
let dealerCards = [];
let cardDel = document.getElementById('cards-dele');
let messageDealer = document.getElementById("message-dele");
let playerDealer = document.getElementById('player-dele');

let sumDealer = 0;

function renderGameDealer() {
  cardDel.textContent = 'Dealer\'s Cards: ' + dealerCards.join(" ");
  playerDealer.textContent = 'Dealer\'s Sum: ' + sumDealer;

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
    message = "You Win!";
    winBet();
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
