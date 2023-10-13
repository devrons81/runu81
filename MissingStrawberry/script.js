"use strict";

let landingScreen = document.getElementById("landingScreen");
let conversation = document.getElementById("conversation");
let startButton = document.getElementById("startButton");

let inGame = document.getElementById("inGame");

let finishScreen = document.getElementById("finishScreen");

let points = document.getElementById("points");

let whereIsDialogue = document.getElementById("whereIsDialogue");

let eggsParent = document.getElementById("eggs");

let eggs = document.querySelectorAll(".eggs > *");

let egg0 = document.getElementById("egg0");
let egg1 = document.getElementById("egg1");
let egg2 = document.getElementById("egg2");

let strawberry = document.querySelector(".egg1 *[data-is-strawberry=true]");
let strawberryEggHead = document.querySelector(".egg1 [data-egg=head]");

let dinosaurEgg;

let playButton = document.getElementById("playButton");
let nextButton = document.getElementById("nextButton");
let restartButton = document.getElementById("restartButton");
let finishButton = document.getElementById("finishButton");

let typedWords = 0;
let typeState = 1;
let conversationText;
let conversationPhase = "deer";
let TypeStatesNumber = 3;
let typeEffectTimeout;
let conversationRemoverTimeout1;

function typeEffect() {
  if (conversationPhase == "programmer") {
    switch (typeState) {
      case 1:
        conversationText = "Hey!";
        break;

      case 2:
        conversationText = "I am the programmer!";
        break;

      case 3:
        conversationText =
          "Don't Worry! I will return the Strawberries to the Baby Deer";
        break;

      case 4:
        conversationText = "Feel free to look at my other works...";
        break;
    }
  } else {
    switch (typeState) {
      case 1:
        conversationText = "Hey!";
        break;

      case 2:
        conversationText = "The bad programmer has stolen my Strawberries...";
        break;

      case 3:
        conversationText = "can you help me to find them?";
        break;
    }
  }

  conversation.textContent += conversationText[typedWords];
  typedWords = conversation.textContent.length;

  if (typedWords < conversationText.length) {
    typeEffectTimeout = setTimeout(typeEffect, 150);
  } else {
    conversationRemoverTimeout1 = setTimeout(() => {
      conversationRemover();
    }, 2500);
  }
}

let conversationRemoverTimeout2;
function conversationRemover() {
  conversation.textContent = conversation.textContent.slice(0, -1);
  typedWords = conversation.textContent.length;
  if (conversation.textContent.length != 0) {
    conversationRemoverTimeout2 = setTimeout(conversationRemover, 50);
  } else {
    typeState++;
    // if typeState > number of conversation texts
    if (typeState > TypeStatesNumber) {
      typeState = 1;
    }
    typeEffect();
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);

startButton.addEventListener("click", (e) => {
  landingScreen.remove();

  clearTimeout(typeEffectTimeout);
  clearTimeout(conversationRemoverTimeout1);
  clearTimeout(conversationRemoverTimeout2);

  inGame.style.display = "grid";
  // Positioning eggs (I don't use flexbox or other methods, because i think this is the simplest way and without tons of bugs)
  let wrapperWidth = eggsParent.offsetWidth;
  let eggWidth = egg0.offsetWidth;
  let gaps = (wrapperWidth - eggWidth * 3) / 4;

  egg0.style.left = gaps + "px";
  egg1.style.left = gaps * 2 + eggWidth + "px";
  egg2.style.left = gaps * 3 + eggWidth * 2 + "px";
});

window.addEventListener("resize", (e) => {
  let wrapperWidth = eggsParent.offsetWidth;
  let eggWidth = egg0.offsetWidth;
  let gaps = (wrapperWidth - eggWidth * 3) / 4;

  egg0.style.left = gaps + "px";
  egg1.style.left = gaps * 2 + eggWidth + "px";
  egg2.style.left = gaps * 3 + eggWidth * 2 + "px";
});

// if user click on next Button immediately after click on an egg...
let strawberryAnimationTimeout;
function eggClick(e) {
  eggs.forEach((item) => item.removeEventListener("click", eggClick));
  let eggHead = e.currentTarget.querySelector("*[data-egg=head]");
  whereIsDialogue.style.opacity = 0;

  strawberryPauseAnimation.cancel();
  if (eggHead.dataset.strawberryEgg) {
    points.textContent++;
    eggHead.classList.add("strawberry-egg-move");

    setTimeout(() => {
      strawberry.style.transform =
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(-27rem)";
    }, 0);

    strawberryAnimationTimeout = setTimeout(() => {
      strawberryAnimation.play();
    }, 800);

    if (round == 10) {
      finishButton.style.display = "block";
    } else {
      nextButton.style.display = "block";
    }
  } else {
    dinosaurEgg = eggHead;
    eggHead.classList.add("dinosaur-egg-move");

    setTimeout(() => {
      document
        .querySelector(".egg1 [data-egg=head]")
        .classList.add("strawberry-egg-move");
      strawberry.style.transform =
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(-27rem)";
      setTimeout(() => {
        restartButton.style.display = "block";
        strawberryAnimation.play();
      }, 800);
    }, 1000);
  }
}

let strawberryPauseAnimation = strawberry.animate(
  [
    {
      transform:
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(-27rem)"
    },
    {
      transform:
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(0)"
    }
  ],
  {
    duration: 500,
    easing: "linear",
    fill: "forwards"
  }
);
strawberryPauseAnimation.cancel();

let strawberryAnimation = strawberry.animate(
  [
    {
      transform:
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(-27rem)"
    },
    {
      transform:
        "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(-30rem)"
    }
  ],
  {
    duration: 1000,
    easing: "ease-in-out",
    direction: "alternate",
    iterations: Infinity
  }
);

let transitionTime = parseInt(eggsParent.style.transitionDuration);
playButton.addEventListener("click", (e) => {
  strawberryEggHead.classList.remove("strawberry-egg-move");
  strawberryAnimation.cancel();
  strawberryPauseAnimation.play();
  strawberry.style.transform =
    "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(0)";
  playButton.remove();

  setTimeout(() => {
    shuffle();
    setTimeout(() => {
      eggs.forEach((item) => item.addEventListener("click", eggClick));
      whereIsDialogue.style.opacity = 1;
    }, transitionTime);
  }, 800);
});

function shuffle() {
  let firstRandomPlace = Math.floor(Math.random() * 3);
  let secondRandomPlace;
  do {
    secondRandomPlace = Math.floor(Math.random() * 3);
  } while (secondRandomPlace == firstRandomPlace);

  let firstEgg = eggs[firstRandomPlace];
  let secondEgg = eggs[secondRandomPlace];

  transitionTime = parseInt(eggsParent.style.transitionDuration);

  let firstEggPosition = firstEgg.style.left;
  let secondEggPosition = secondEgg.style.left;

  firstEgg.style.left = secondEggPosition;
  secondEgg.style.left = firstEggPosition;
}

let round = 1;
nextButton.addEventListener("click", (e) => {
  round++;
  strawberryEggHead.classList.remove("strawberry-egg-move");
  strawberryAnimation.cancel();
  clearTimeout(strawberryAnimationTimeout);
  strawberryPauseAnimation.play();
  strawberry.style.transform =
    "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(0)";
  nextButton.style.display = "none";

  eggsParent.style.transition = 1200 - round * 100 + "ms";
  transitionTime = parseInt(eggsParent.style.transitionDuration);
  setTimeout(() => {
    shuffle();
    for (let i = 1; i < round; i++) {
      setTimeout(() => {
        shuffle();
      }, transitionTime * i);
    }
    setTimeout(() => {
      eggs.forEach((item) => item.addEventListener("click", eggClick));
    }, transitionTime * round);
  }, 800);
});

restartButton.addEventListener("click", (e) => {
  round = 1;
  points.textContent = "0";
  eggsParent.style.transition = 1200 - round * 100 + "ms";

  dinosaurEgg.classList.remove("dinosaur-egg-move");
  strawberryEggHead.classList.remove("strawberry-egg-move");
  strawberryAnimation.cancel();
  strawberryPauseAnimation.play();
  strawberry.style.transform =
    "matrix(4.67533, 0, 0, 4.67533, 298.147, 440.973) translateY(0)";
  restartButton.style.display = "none";

  setTimeout(() => {
    shuffle();
    setTimeout(() => {
      eggs.forEach((item) => item.addEventListener("click", eggClick));
      whereIsDialogue.style.opacity = 1;
    }, transitionTime * round);
  }, 800);
});

finishButton.addEventListener("click", (e) => {
  inGame.remove();
  finishScreen.style.display = "grid";
  TypeStatesNumber = 4;
  typedWords = 0;
  typeState = 1;
  conversation = document.getElementById("programmerConversation");
  conversationPhase = "programmer";
  typeEffect();
});