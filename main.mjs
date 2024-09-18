const API_URL = 'https://deckofcardsapi.com/api/deck';

// Función para crear una nueva baraja
async function createDeck() {
    const response = await fetch(`${API_URL}/new/`);
    const data = await response.json();
    return data.deck_id;
}




let deckId = '';


async function createDeck() {
    const response = await fetch(`${API_URL}/new/`);
    const data = await response.json();
    deckId = data.deck_id;
    return deckId;
}

async function drawCard() {
    const response = await fetch(`${API_URL}/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    if (data.cards.length > 0) {
        return data.cards[0];
    } else {
        return null;
    }
}


let cards = [];
let hasBlackJack = false;
let isAlive = false;
let sum = 0;
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");


// Cargar el estado desde localStorage
function loadState() {
  currentNumberOne = parseInt(localStorage.getItem('currentNumberOne')) || 0;
  progress = parseInt(localStorage.getItem('progress')) || 0;
  
  // Actualizar la interfaz con los valores cargados
  document.getElementById('left-number').textContent = currentNumberOne;
  document.getElementById('right-number').textContent = currentNumberTwo;
  document.getElementById('fill-bar').style.width = progress + '%';
}

// Función para guardar el estado en localStorage
function saveState() {
  localStorage.setItem('currentNumberOne', currentNumberOne);
  localStorage.setItem('progress', progress);
}

// Función para incrementar el progreso
function increaseProgress() {
  if (progress < maxProgress) {
    progress += 1; // Incrementa la barra en 1%
    if (progress > maxProgress) progress = maxProgress;

    document.getElementById('fill-bar').style.width = '100%';

    // Incrementar el número actual
    currentNumberOne++;
    
    // Esperar a que la animación termine y luego volver al progreso actual
    setTimeout(() => {
      document.getElementById('fill-bar').style.width = progress + '%';
      // Guardar el estado después de la animación
      saveState();
    }, 1000); // Coincide con la duración de la animación en CSS

    // Actualizar la interfaz
    document.getElementById('left-number').textContent = currentNumberOne;
  }
}

// Inicialización de las variables
let currentNumberOne = parseInt(localStorage.getItem('currentNumberOne')) || 0;
let currentNumberTwo = 100; // El número de la derecha permanece constante
let progress = parseInt(localStorage.getItem('progress')) || 0;
let maxProgress = 100;

// Cargar el estado al cargar la página
window.onload = loadState;




document.getElementById("newCard").style.display = "none";
document.getElementById("stand").style.display = "none";

let player = {
  name: "David",
};

// Inicializar con 200 chips o el valor guardado en localStorage
let chips = [
  localStorage.getItem("chips") ? parseInt(localStorage.getItem("chips")) : 200,
];


// Función para contar gradualmente el cambio de fichas
function animateChipsChange(start, end, duration) {
  let range = end - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = timestamp - startTime;
    let increment = Math.min(progress / duration, 1); // Calcula el progreso en función de la duración
    let current = Math.floor(start + range * increment); // Actualiza el número actual

    playerEl.textContent = player.name + ": £" + current;

    if (progress < duration) {
      window.requestAnimationFrame(step); // Continuar la animación
    } else {
      playerEl.textContent = player.name + ": £" + end; // Asegurarse de mostrar el número final exacto
    }
  }

  window.requestAnimationFrame(step);
}



function updateChips(newChipsValue) {
  let currentChips = chips[0]; // Valor actual de las fichas
  chips[0] = newChipsValue; // Actualizar el valor de las fichas

  // Guardar en localStorage
  localStorage.setItem("chips", chips[0]);

  // Iniciar la animación
  animateChipsChange(currentChips, chips[0], 1000); // Duración de 1 segundo (1000ms)
}




let counterEl = document.getElementById("counter-el");
let counter = 60; // Tiempo en segundos




// Incrementar chips cada minuto
setInterval(function () {

  chips[0] += 10; // Incrementar chips en 10 cada minuto
  playerEl.textContent = player.name + ": £" + chips[0];
  counter = 60; // Reiniciar el contador a 60 segundos
  localStorage.setItem("chips", chips[0]); // Actualizar localStorage
}, 60000); // 60000 milisegundos = 1 minuto  cambiarlo a 60000 cuando este terminado

// Actualizar el contador cada segundo
setInterval(function () {
  if (counter > 0) {
    counter--; // Decrementar el contador
    counterEl.textContent = "Next chips in: " + counter + "s";
  }
}, 1000); // 1000 milisegundos = 1 segundo




let playerEl = document.getElementById("player-el");
playerEl.textContent = player.name + ": £dd" + chips[0]   ;

// Función para obtener una carta aleatoria
function getRandomCard() {
  let randomIndex = Math.floor(Math.random() * cardDeck.length);
  return cardDeck[randomIndex];
}

let betAmount = 0; // Cantidad actual de la apuesta
let betSum = document.getElementById("betSum");

startGamePricipal.classList.add("startGamePricipal"); // Agregar la clase de animación
PlaceBet.classList.add("PlaceBet");

function bet(amount) {
  if (chips[0] >= amount) {
    betAmount += amount;
    updateChips(chips[0] - amount); // Restar fichas con animación

    updateBetDisplay();
    updateBetImageColor();
    betSum.classList.remove("visiblilityNumber");

    const PlaceBet = document.querySelector(".PlaceBet");
    PlaceBet.classList.add("PlaceBetOut");

    PlaceBet.addEventListener(
      "transitionend",
      () => {
        PlaceBet.style.display = "none";
      },
      { once: true }
    );

    betImage.classList.remove("spinAndDisappear");
    const startGameElement = document.getElementById("startGamePricipal");
    startGameElement.style.opacity = 3;
  } else {
    toastr.error("Not enough chips to place this bet");
  }
}

// es el chip de la apuesta
// function chipMove() {
//   betImage.classList.remove("fade"); // Remover la clase para reiniciar la animación
//   void betImage.offsetWidth; // Forzar un reflujo para reiniciar la animación
//   betImage.classList.add("fade"); // Agregar la clase de cambio de opacidad
// }

function cleanBet() {
  // Devolver el valor de la apuesta a las fichas del jugador
  chips[0] += betAmount;
  // Resetear la apuesta a 0
  betAmount = 0;

  // Actualizar la visualización para mostrar la apuesta eliminada y las fichas actualizadas
  inicialColor();
  updateBetDisplay();
  betSum.classList.add("visiblilityNumber"); // Reset text color after animation
  localStorage.setItem("chips", chips[0]); // Actualizar localStorage

  betImage.classList.add("spinAndDisappear"); // Agregar la clase de animación
  // betImage.classList.add("moveBackUp"); // Agregar la clase de animación
}

function updateBetDisplay() {
  betSum.textContent = +betAmount;
  playerEl.textContent = player.name + ": £" + chips[0];
}

function loseBet() {
  setTimeout(function () {
    betAmount = 0; // Resetear la apuesta

    updateBetDisplay();

    loseBetEfect();
  }, 3000);
}

function winBet() {
  increaseProgress();
  setTimeout(function () {
    let winnings = betAmount * 2; // Ganancias (el doble de la apuesta)
    
    // Actualizar las fichas con animación sumando las ganancias
    updateChips(chips[0] + winnings); 
    
    betAmount = 0;
    updateBetDisplay();
    localStorage.setItem("chips", chips[0]);
    
    winBetEfect(); // Efecto visual o sonido de ganar
  }, 3000); // Después de 3 segundos de ganar
}

let hasDrawnCard = false; // Variable para rastrear si el jugador ha pedido una nueva carta

function startGame() {
  if (betAmount > 0) {
    isAlive = true;
    hasBlackJack = false;
    hasDrawnCard = false;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard.value + secondCard.value;
    betImage.style.opacity = "1";

    let firstCardDealer = getRandomCard();
    dealerCards = [firstCardDealer];
    sumDealer = firstCardDealer.value;
   
    document.getElementById("doubleBet").style.display = "flex";
    document.getElementById("startGame").style.display = "none";
    document.getElementById("newCard").style.display = "flex";
    document.getElementById("stand").style.display = "flex";
    document.getElementById("bet-buttons").style.display = "none";
    betImage.classList.remove("spinAndDisappear"); // Agregar la clase de animación
    

    document.getElementById("cleanBet").style.display = "none"; // Ocultar el botón de limpiar apuesta

    renderGame();
    renderGameDealer();
  } else {
    toastr.error("Please place a bet before starting the game.");
  }
}

function renderGame() {
  cardsEl.innerHTML = ""; // Clear previous cards
  let cardOffset = 0; // Offset for stacking cards

  for (let card of cards) {
    let img = document.createElement("img");
    img.src = card.image;
    img.style.width = "50px";
    img.style.height = "70px";
    img.style.top = `0px`;
    img.style.left = `${cardOffset}px`; // Set the initial position
    img.style.transform = `translate(${cardOffset}px, 0px)`; // Apply the translation

    // Add the animation class
    img.classList.add("dropFromTopRight");

    // Append the card to the container
    cardsEl.appendChild(img);

    cardOffset += 30; // Adjust this value for more or less overlap
  }
  sumEl.textContent = "" + sum;

   sumEl.classList.add("sum");
   playerDealer.classList.add("sumDel");
  
  

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
    sum += card.value; // Sumar el valor de la nueva carta a la suma total
    cards.push(card);
    hasDrawnCard = true;
    let lastCard = cards[cards.length - 1];
    let img = document.createElement("img");
    img.src = lastCard.image;
    img.style.width = "50px";
    img.style.height = "70px";
    img.style.top = `0px`;
    img.style.left = `${(cards.length - 1) * 30}px`; // Ajustar la posición de acuerdo con la cantidad de cartas
    img.style.transform = `translate(${(cards.length - 1) * 30}px, 0px)`; // Aplicar la traslación
    img.classList.add("dropFromTopRight"); // Agregar la clase de animación
    cardsEl.appendChild(img); // Agregar la nueva carta al contenedor de cartas
    sumEl.textContent = "" + sum;

    if (sum > 21) {
      message = "You Bust! Dealer Wins!";
      isAlive = false;
      loseBet();
      resetGameAfterDelay();
    }
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
  document.getElementById("doubleBet").style.display = "none";
}

function dealerNewCard() {
  while (sumDealer < 17) {
    let card = getRandomCard();
    dealerCards.push(card);
    sumDealer += card.value;
  }
  renderGameDealer(); // Actualizar la visualización del dealer después de añadir una nueva carta
}

function doubleBet() {
  if (chips[0] >= betAmount && !hasDrawnCard) {
    // Solo permitir doblar la apuesta si no se ha pedido una nueva carta
    chips[0] -= betAmount;
    betAmount *= 2;
    updateBetDisplay();
    localStorage.setItem("chips", chips[0]); // Actualizar localStorage

    // Pedir una nueva carta
    let card = getRandomCard();
    sum += card.value;
    cards.push(card);
    hasDrawnCard = true; // Marcar que el jugador ha pedido una nueva carta
    document.getElementById("doubleBet").style.display = "none"; // Ocultar el botón de doblar apuesta
    renderGame();

    // Si la tercera carta se da al jugador, termina el juego
    if (sum > 21) {
      message = "You Bust! Dealer Wins!";
      isAlive = false;
      loseBet(); // Perder la apuesta si se pasa de 21
      resetGameAfterDelay(); // Reiniciar el juego después de 3 segundos
    }
  } else {
    toastr.error(
      "Not enough chips to double the bet or you've already drawn a new card."
    );
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
  cardDel.innerHTML = "";
  let cardOffset = 0; // Offset for stacking cards

  for (let card of dealerCards) {
    let img = document.createElement("img");
    img.src = card.image;
    img.style.width = "50px";
    img.style.height = "70px";
    img.style.top = `0px`;
    img.style.left = `${cardOffset}px`; // Set the initial position
    img.style.transform = `translate(${cardOffset}px, 0px)`; // Apply the translation

    // Add the animation class
    img.classList.add("dropFromTopRight");

    // Append the card to the container
    cardDel.appendChild(img);

    cardOffset += 30; // Adjust this value for more or less overlap
  }

  playerDealer.textContent = "" + sumDealer;
 


  if (sumDealer > 21) {
    messageDealer.textContent = "Dealer Busted!";
  } else if (sumDealer === 21) {
    messageDealer.textContent = "Dealer got Blackjack!";
  
  }
}



function stand() {
  dealerNewCard(); // El dealer comienza a tomar cartas solo cuando el jugador decide "stand"

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
  resetGameAfterDelay(); // Reiniciar el juego después de 3 segundos
}

function resetGameAfterDelay() {
  setTimeout(function () {
    cards = [];
    dealerCards = [];
    sum = 0;
    sumDealer = 0;
    messageEl.textContent = "";
    cardsEl.textContent = "";
    sumEl.textContent = "";
    cardDel.textContent = "";
    playerDealer.textContent = "";
    messageDealer.textContent = "";
    document.getElementById("doubleBet").style.display = "none"; // Ocultar el botón de doblar apuesta
    document.getElementById("newCard").style.display = "none";
    document.getElementById("stand").style.display = "none";
    document.getElementById("bet-buttons").style.display = "none";
    document.getElementById("bet-buttons").style.display = "block";
    inicialColor();
    document.getElementById("cleanBet").style.display = "flex"; // Mostrar el botón de limpiar apuesta
    document.getElementById("startGame").style.display = "flex";
    sumEl.classList.remove("sum");
    playerDealer.classList.remove("sumDel");
  
    
  }, 3000);
}

// aqui va la parte de la img de sum:el

// ...

// Aquí definimos el elemento betImage después de haber declarado la variable betSum
function updateBetImageColor() {
  // Verificar el valor de la apuesta y cambiar el color de la imagen en consecuencia
  if (betAmount > 600) {
    // Cambiar el color de la imagen a rojo si la apuesta es mayor que 600
    betImage.style.filter = "hue-rotate(0deg) saturate(200%)"; // Rojo intenso
  } else if (betAmount > 300) {
    // Cambiar el color de la imagen a amarillo si la apuesta es mayor que 300
    betImage.style.filter = "hue-rotate(60deg) saturate(150%)"; // Amarillo intenso
  } else if (betAmount > 100) {
    // Cambiar el color de la imagen a verde si la apuesta es mayor que 100
    betImage.style.filter = "hue-rotate(120deg) saturate(120%)"; // Verde intenso
  } else if (betAmount > 5) {
    // Cambiar el color de la imagen a azul si la apuesta es mayor que 5
    betImage.style.filter = "hue-rotate(190deg) saturate(80%)"; // Azul intenso
  } else {
    // Restaurar el color de la imagen a su estado original si la apuesta es 5 o menor
    betImage.style.filter = "none";
  }
}

function inicialColor() {
  betImage.style.filter = "none";
}

// Llamar a la función para que se ejecute al cargar la página
updateBetImageColor();

///// here it where it will go all the efect win lose tie and clean
function winBetEfect() {
  betImage.classList.add("move-to-top-left"); // Agregar la clase de animación
  betSum.classList.add("visiblilityNumber"); // Cambiar el color del texto a negro

  // Después de que la animación termine, hacer que el elemento crezca más grande
  setTimeout(() => {
    betImage.classList.remove("move-to-top-left"); // Quitar la clase de la primera animación
    betImage.classList.add("grow-bigger"); // Añadir la clase para agrandarse

    // Después de que se agrande, volver a la posición original
    setTimeout(() => {
      betImage.classList.remove("grow-bigger"); // Quitar la clase de agrandamiento
      betImage.classList.add("move-back"); // Añadir la clase para volver a la posición original

      // Remover la clase move-back después de la animación
      setTimeout(() => {
        betImage.classList.remove("move-back");

        // Ocultar la imagen al establecer su opacidad en 0
        betImage.style.opacity = "0";

        // Después de un breve retraso, hacer que la imagen aparezca gradualmente aumentando su opacidad de 0 a 1
        setTimeout(() => {
          betImage.style.transition = "opacity 2s"; // Agregar una transición de opacidad
          betImage.style.opacity = "1"; // Aumentar la opacidad gradualmente
          animationApplied = false; // Permitir que la animación se pueda aplicar nuevamente
          betSum.classList.remove("visiblilityNumber"); // Reset text color after animation
        }, 1000); // El retraso debe ser menor que la duración de la transición (0.5s en este caso)
      }, 10); // La duración debe coincidir con la duración de la animación moveBack (1s en este caso)
    }, 500); // La duración debe coincidir con la duración de la animación growBigger (0.5s en este caso)
  }, 1000); // La duración debe coincidir con la duración de la animación moveToTopLeft (1s en este caso)
}

function loseBetEfect() {
  betImage.classList.add("move-to-top-right"); // Agregar la clase de animación
  betSum.classList.add("visiblilityNumber"); // Cambiar el color del texto a negro

  // Después de que la animación termine, hacer que el elemento crezca más grande
  setTimeout(() => {
    betImage.classList.remove("move-to-top-right"); // Quitar la clase de la primera animación
    betImage.classList.add("grow-bigger"); // Añadir la clase para agrandarse

    // Después de que se agrande, volver a la posición original
    setTimeout(() => {
      betImage.classList.remove("grow-bigger"); // Quitar la clase de agrandamiento
      betImage.classList.add("move-back"); // Añadir la clase para volver a la posición original

      // Remover la clase move-back después de la animación
      setTimeout(() => {
        betImage.classList.remove("move-back");

        // Ocultar la imagen al establecer su opacidad en 0
        betImage.style.opacity = "0";

        // Después de un breve retraso, hacer que la imagen aparezca gradualmente aumentando su opacidad de 0 a 1
        setTimeout(() => {
          betImage.style.transition = "opacity 2s"; // Agregar una transición de opacidad
          betImage.style.opacity = "1"; // Aumentar la opacidad gradualmente
          animationApplied = false; // Permitir que la animación se pueda aplicar nuevamente
          betSum.classList.remove("visiblilityNumber"); // Reset text color after animation
        }, 1000); // El retraso debe ser menor que la duración de la transición (0.5s en este caso)
      }, 10); // La duración debe coincidir con la duración de la animación moveBack (1s en este caso)
    }, 500); // La duración debe coincidir con la duración de la animación growBigger (0.5s en este caso)
  }, 1000); // La duración debe coincidir con la duración de la animación moveToTopLeft (1s en este caso)
}

///
/// Aqui es donde va a ir toda la funciones de las cartas
const cardDeck = [
  { image: "img/toppng.com-fichas-poker-248x701.png", value: 1 || 10 },
  { image: "img/toppng.com-fichas-poker-248x701.png", value: 2 },
  { image: "img/Screenshot 2024-06-04 212254.png", value: 3 },
  { image: "img/toppng.com-poker-1664x2123.png", value: 4 },
  {
    image:
      "img/toppng.com-stacks-of-poker-chips-png-graphic-transparent-cartoon-poker-chips-1403x1173.png",
    value: 5,
  },
  { image: "img/cartasPoker/card (5).png", value: 6 },
  { image: "img/cartasPoker/card (6).png", value: 7 },
  { image: "img/cartasPoker/card (7).png", value: 8 },
  { image: "img/cartasPoker/card (8).png", value: 9 },
  { image: "img/cartasPoker/card (9).png", value: 10 },
  { image: "img/cartasPoker/card (10).png", value: 10 },
  { image: "img/cartasPoker/card (11).png", value: 10 },
  { image: "img/cartasPoker/card (12).png", value: 10 },
  { image: "img/cartasPoker/card (13).png", value: 11 },
  // Repite para los otros palos: diamantes, corazones y espadas
];
