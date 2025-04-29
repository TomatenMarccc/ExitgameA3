const allSliders = document.querySelectorAll('.slider');
const sliders = [
  allSliders[2], // 3. Slider
  allSliders[4], // 5. Slider
  allSliders[1], // 2. Slider
  allSliders[3], // 4. Slider
  allSliders[0], // 1. Slider
];

const statusText = document.getElementById('status');
const timerText = document.getElementById('timer');
const lamp = document.getElementById('lamp');

const startSound = document.getElementById('startSound');
const completeSound = document.getElementById('completeSound');
const sliderSound = document.getElementById('sliderSound');
const errorSound = document.getElementById('errorSound');
const successSound = document.getElementById('successSound');

let current = 0;
let nextTime = null;
let timerInterval;
lamp.classList.add('blinking');

function resetAll() {
  lamp.classList.remove('green', 'blinking');
  document.querySelectorAll('.slider').forEach(slider => {
    slider.value = 0;
    slider.classList.remove('done');

    // Knopf zurücksetzen
    const knopf = slider.closest('.slider-container').querySelector('.knopf');
    if (knopf) {
      knopf.style.top = '0px';
    }
  });
  current = 0;
  nextTime = null;
  statusText.textContent = "Fehler! Starte von vorn.";
  lamp.classList.add('blinking');
  clearInterval(timerInterval);
  timerText.textContent = "0.00 s";
  timerText.classList.remove('green', 'red');
  errorSound.play();
}

function complete() {
  clearInterval(timerInterval);
  statusText.textContent = "Die Reaktorstäbe wurden erfolgreich heruntergefahren";
  lamp.classList.remove('blinking');
  lamp.classList.add('green');
  completeSound.play();
}

function startTimer() {
  lamp.classList.add('blinking');

  if (timerInterval) clearInterval(timerInterval);
  const start = performance.now();

  timerInterval = setInterval(() => {
    let elapsed = (performance.now() - start) / 1000;
    timerText.textContent = `${elapsed.toFixed(2)} s`;

    if (elapsed >= 4 && elapsed <= 5) {
      timerText.classList.add('green');
      timerText.classList.remove('red');
    } else {
      timerText.classList.remove('green');
      timerText.classList.add('red');
    }
  }, 100);
}

sliders.forEach((slider, index) => {
  slider.addEventListener('input', () => {
    const value = parseInt(slider.value);
    sliderSound.play();

    if (slider.classList.contains('done')) return;

    if (value >= 100) {
      if (sliders[current] === slider) {
        const now = performance.now();

        if (current === 0) {
          startSound.play();
          startTimer();
          nextTime = now;
        } else {
          const elapsed = (now - nextTime) / 1000;
          if (elapsed < 4 || elapsed > 5) {
            resetAll();
            return;
          }
        }

        slider.classList.add('done');
        successSound.play();
        current++;

        if (current < sliders.length) {
          startTimer();
          nextTime = performance.now();
        } else {
          complete();
        }
      } else {
        resetAll();
      }
    }
  });
});

// Knopfbewegung synchronisieren
const sliderContainers = document.querySelectorAll('.slider-container');

sliderContainers.forEach(container => {
  const slider = container.querySelector('.slider');
  const knopf = container.querySelector('.knopf');

  const updateKnopf = () => {
    const value = parseInt(slider.value);
    const max = parseInt(slider.max);
    const min = parseInt(slider.min);
    const percent = (value - min) / (max - min);

    const sliderHeight = slider.offsetHeight;
    const knopfHeight = knopf.offsetHeight;

    const position = percent * (sliderHeight - knopfHeight);
    knopf.style.top = `${position}px`;
  };

  slider.addEventListener('input', updateKnopf);
  updateKnopf(); // initial setzen
});