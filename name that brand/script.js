let logos = [
  {
    logoImag: 'img/puma.webp',
    result: 'PUMA',
    keyboard: 'TSPDLKMNBVAU',
    numberWords: 4,
    hint: 'img/puma.webp'
  },
  {
    logoImag: 'img/lacoste.webp',
    result: 'LACOSTE',
    keyboard: 'TSODLKCNBVAE',
    numberWords: 7,
    hint: 'img/lacoste.webp'
  },
  {
    logoImag: 'img/windows.webp',
    result: 'WINDOWS',
    keyboard: 'TWPDUSRNBOAI',
    numberWords: 7,
    hint: 'img/windows.webp'
  },
  {
    logoImag: 'img/starbucks.webp',
    result: 'STARBUCKS',
    keyboard: 'TSPDUKRNBVAC',
    numberWords: 9,
    hint: 'img/starbucks.webp'
  },
  {
    logoImag: 'img/snapshot.webp',
    result: 'SNAPSHOT',
    keyboard: 'TSPDUGRNOVAH',
    numberWords: 8,
    hint: 'img/snapshot.webp'
  },
  {
    logoImag: 'img/google.webp',
    result: 'GOOGLE',
    keyboard: 'LSPDUGRNOVAE',
    numberWords: 6,
    hint: 'img/google.webp'
  },
  {
    logoImag: 'img/lego.webp',
    result: 'LEGO',
    keyboard: 'LSPDUGRNOVAE',
    numberWords: 4,
    hint: 'img/hlego.jpg'
  },
  {
    logoImag: 'img/pringles.webp',
    result: 'PRINGLES',
    keyboard: 'LSPDUGRNIVAE',
    numberWords: 8,
    hint: 'img/pringles.webp'
  },
  {
    logoImag: 'img/adidas.webp',
    result: 'ADIDAS',
    keyboard: 'LSPDUTHJIVAB',
    numberWords: 6,
    hint: 'img/adidas.webp'
  },
  {
    logoImag: 'img/pepsi.webp',
    result: 'PEPSI',
    keyboard: 'LSPEUTHJIVAB',
    numberWords: 5,
    hint: 'img/pepsi.webp'
  },
  {
    logoImag: 'img/pizzahut.jpg',
    result: 'PIZZAHUT',
    keyboard: 'PHAKQJIKZULT',
    numberWords: 8,
    hint: 'img/hpizza.png'
  },
  {
    logoImag: 'img/shell.webp',
    result: 'SHELL',
    keyboard: 'LSPEUTHJQVAB',
    numberWords: 5,
    hint: 'img/shell.webp'
  },
  {
    logoImag: 'https://i.imgur.com/MgM6m8i.jpg',
    result: 'AMAZON',
    keyboard: 'ABXCRTMUZRON',
    numberWords: 6,
    hint: 'https://i.imgur.com/YqLTOe0.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/LaV3C1z.jpg',
    result: 'ANDROID',
    keyboard: 'ABNDOYRID',
    numberWords: 7,
    hint: 'https://i.imgur.com/LaV3C1z.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/ZVBkPh3.jpg',
    result: 'IKEA',
    keyboard: 'IMEHAKNBC',
    numberWords: 4,
    hint: 'https://i.imgur.com/YinYiva.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/Yxy0POs.jpg',
    result: 'MASTERCARD',
    keyboard: 'AMTRCDESBULM',
    numberWords: 10,
    hint: 'https://i.imgur.com/VDzBKnw.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/KGDVPqT.jpg',
    result: 'NIVEA',
    keyboard: 'NVSIBEPLEA',
    numberWords: 5,
    hint: 'https://i.imgur.com/OOvFGTP.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/itIU9Ku.jpg',
    result: 'REDBULL',
    keyboard: 'REIOFBUDYL',
    numberWords: 7,
    hint: 'https://i.imgur.com/oSUd9lX.jpg'
  },
  {
    logoImag: 'https://i.imgur.com/832SiwZ.jpg',
    result: 'SKYPE',
    keyboard: 'SZYKEPNBY',
    numberWords: 5,
    hint: 'https://i.imgur.com/dYh6kaH.jpg'
  },
  {
    logoImag: 'img/dove.jpg',
    result: 'DOVE',
    keyboard: 'SVYOEPDBE',
    numberWords: 4,
    hint: 'img/dove.jpg'
  }
];

function About(container) {
  container.innerHTML = ` <img src="https://i.imgur.com/zNb1aca.jpg" alt="">
  <p>This App Is Created By Dadda-Soft 2020</p>`;
}
function Follow(container) {
  container.innerHTML = ` <div class="social__wrapper">
  <div class="facebook">
      <span></span>/ daddasoft
  </div>
  <div class="instagram">
      <span></span>/ daddasoft
  </div>
  <div class="siteweb">
      <span></span>/ daddasoft.best
  </div>
</div>`;
}
let step = +localStorage.getItem('logo') || 0;

let ZoomPlus = document.querySelector('.app_side .plus');
let ZoomMinus = document.querySelector('.app_side .minus');
let btnClear = document.getElementById('btn__clear');
let YeahButton = document.getElementById('button_yeah');
let popup = document.querySelector('.win__popup');
let MenuPopup = document.querySelector('.app_menu');
let LogoImage = document.querySelector('.logo__image');

const answerWrapper = document.querySelector('.answer__wrapper');
const keyboardWrapper = document.querySelector('.keyboard__wrapper');
loadData();
function loadData() {
  answerWrapper.innerHTML = null;
  keyboardWrapper.innerHTML = null;
  for (let i = 0; i < logos[step].numberWords; i++) {
    answerWrapper.innerHTML += `<div class="zoneText answer"></div>`;
  }
  for (let i = 0; i < logos[step].keyboard.length; i++) {
    keyboardWrapper.innerHTML += `<div class="zoneText word">${logos[step].keyboard[i]}</div>`;
  }
  let h = localStorage.getItem('itemHeight') || 40;
  let w = localStorage.getItem('itemWidth') || 40;
  document.querySelectorAll('.word').forEach(function(item) {
    item.style.height = `${h}px`;
    item.style.width = `${w}px`;
  });
  LogoImage.src = `${logos[step].logoImag}`;
}
keyboardWrapper.addEventListener('click', function(e) {
  if (e.target.classList.contains('word')) {
    let place = document.querySelectorAll('.answer');
    // console.log(e.target.textContent);
    // console.log(place);

    for (let i = 0; i < place.length; i++) {
      if (!place[i].firstChild) {
        place[
          i
        ].innerHTML = `<span class="answer__text">${e.target.textContent}</span>`;
        break;
      }
    }
    cc();
  }
});

function cc() {
  const place = document.querySelectorAll('.answer__text');
  let answer = '';
  for (let j = 0; j < place.length; j++) {
    answer += place[j].textContent;
  }
  if (answer === logos[step].result) {
    document.querySelector('.logo__res').src = logos[step].hint;
    popup.style.transform = 'scale(1)';
  }
  console.log(answer);
}

answerWrapper.addEventListener('click', function(e) {
  if (e.target.classList.contains('answer__text')) {
    console.log('Have Text');
    e.target.remove();
  } else if (e.target.classList.contains('answer')) {
    console.log('Have Not a Text');
  }
});
YeahButton.addEventListener('click', function() {
  if (step == logos.length - 1) {
    popup.style.transform = 'scale(0)';
    document.querySelector('.clear__popup').style.transform = 'scale(1)';
  } else {
    popup.style.transform = 'scale(0)';
    step++;
    localStorage.setItem('logo', step);
    loadData();
  }
});
MenuPopup.addEventListener('click', function() {
  document.querySelector('.menu__popup').style.transform = 'scale(1)';
  document.querySelector('.clear').addEventListener('click', function() {
    document.querySelector('.menu__popup').style.transform = 'scale(0)';
    document.querySelector('.menu__popup .content').innerHTML = null;
  });
  document.querySelector('.about').addEventListener('click', function() {
    About(document.querySelector('.menu__popup .content'));
  });
  document.querySelector('.follow').addEventListener('click', function() {
    Follow(document.querySelector('.menu__popup .content'));
  });
});
btnClear.addEventListener('click', function() {
  document.querySelector('.clear__popup').style.transform = 'scale(0)';
  localStorage.removeItem('logo');
  step = 0;
  loadData();
});
ZoomPlus.addEventListener('click', function() {
  document.querySelectorAll('.word').forEach(function(item) {
    let a = item.offsetHeight;
    let b = item.offsetWidth;
    item.style.height = `${a + 1}px`;
    item.style.width = `${b + 1}px`;
  });
  localStorage.setItem(
    'itemWidth',
    document.querySelector('.word').offsetWidth
  );
  localStorage.setItem(
    'itemHeight',
    document.querySelector('.word').offsetHeight
  );
  console.log('cc');
});
ZoomMinus.addEventListener('click', function() {
  document.querySelectorAll('.word').forEach(function(item) {
    let a = item.offsetHeight;
    let b = item.offsetWidth;
    item.style.height = `${a - 1}px`;
    item.style.width = `${b - 1}px`;
  });
  localStorage.setItem(
    'itemWidth',
    document.querySelector('.word').offsetWidth
  );
  localStorage.setItem(
    'itemHeight',
    document.querySelector('.word').offsetHeight
  );
  console.log('cc --');
});