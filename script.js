
// MOBILE NAVIGATION
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("active");
  menuBtn.setAttribute("aria-expanded", String(opened));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// COPYRIGHT YEAR
document.getElementById("year").textContent =
  new Date().getFullYear();

// BMI CALCULATOR
const bmiButton = document.getElementById("bmiButton");

bmiButton.addEventListener("click", () => {
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const result = document.getElementById("bmiResult");

  if (
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height < 50 || height > 250 ||
    weight < 10 || weight > 400
  ) {
    result.textContent = "Please enter a valid height and weight.";
    return;
  }

  const bmi = weight / ((height / 100) ** 2);
  let category = "";

  if (bmi < 18.5) {
    category = "Below the standard adult BMI range";
  } else if (bmi < 25) {
    category = "Within the standard adult BMI range";
  } else if (bmi < 30) {
    category = "Above the standard adult BMI range";
  } else {
    category = "High adult BMI range";
  }

  result.textContent = `Your BMI: ${bmi.toFixed(1)} — ${category}.`;
});

// WORKOUT TIMER
let remaining = 30;
let interval = null;

const display = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const startButton = document.getElementById("startTimer");
const resetButton = document.getElementById("resetTimer");

function updateTimer() {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  display.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

document.querySelectorAll(".timer-presets button").forEach(button => {
  button.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;

    remaining = Number(button.dataset.seconds);
    startButton.textContent = "START";
    timerStatus.textContent = "Timer ready.";
    updateTimer();
  });
});

startButton.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
    startButton.textContent = "RESUME";
    timerStatus.textContent = "Timer paused.";
    return;
  }

  if (remaining <= 0) {
    timerStatus.textContent = "Select a duration to start again.";
    return;
  }

  startButton.textContent = "PAUSE";
  timerStatus.textContent = "Stay focused. Keep moving!";

  interval = setInterval(() => {
    remaining--;
    updateTimer();

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;
      startButton.textContent = "START";
      timerStatus.textContent = "Time's up! Great work.";
    }
  }, 1000);
});

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  remaining = 30;
  startButton.textContent = "START";
  timerStatus.textContent = "Timer reset. Ready for your next set.";
  updateTimer();
});

updateTimer();

// WHATSAPP ENQUIRY
document.getElementById("enquiryForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const goal = document.getElementById("customerGoal").value;
  const plan = document.getElementById("customerPlan").value;

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  const message = `Hello Pro Fitness!

I would like to enquire about gym membership.

Name: ${name}
Phone: ${phone}
Fitness Goal: ${goal}
Membership: ${plan}

Please share the membership details and current fees.

Thank you!`;

  const url = "https://wa.me/917975222680?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
});
