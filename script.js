
"use strict";

// ==========================================
// PRO FITNESS - MAIN JAVASCRIPT
// ==========================================

const WHATSAPP_NUMBER = "917975222680";

function sendWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// ==========================================
// FOOTER YEAR
// ==========================================

document.getElementById("year").textContent = new Date().getFullYear();

// ==========================================
// DARK / LIGHT MODE
// ==========================================

const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.className = "theme-toggle";
themeButton.setAttribute("aria-label", "Toggle dark and light theme");
themeButton.textContent = "◐";
themeButton.title = "Change theme";
document.body.appendChild(themeButton);

const savedTheme = localStorage.getItem("proFitnessTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function updateThemeButton() {
  const dark = document.body.classList.contains("dark-mode");
  themeButton.textContent = dark ? "☀" : "◐";
  themeButton.title = dark ? "Switch to light mode" : "Switch to dark mode";
}

updateThemeButton();

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const dark = document.body.classList.contains("dark-mode");
  localStorage.setItem("proFitnessTheme", dark ? "dark" : "light");

  updateThemeButton();
});

// ==========================================
// THEME BUTTON STYLING
// ==========================================

const themeStyle = document.createElement("style");
themeStyle.textContent = `
.theme-toggle {
  position: fixed;
  z-index: 39;
  left: 20px;
  bottom: 22px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid var(--green);
  background: var(--white);
  color: var(--green);
  box-shadow: 0 5px 20px rgba(0,0,0,.12);
  font-size: 19px;
  cursor: pointer;
}
`;
document.head.appendChild(themeStyle);

// ==========================================
// MEMBERSHIP ENQUIRY BUTTONS
// ==========================================

document.querySelectorAll(".plan-button").forEach(button => {
  button.addEventListener("click", () => {
    const plan = button.dataset.plan || "Membership";
    sendWhatsApp(
      `Hello Pro Fitness! I am interested in the ${plan}. Please share the current price, benefits and membership details.`
    );
  });
});

// ==========================================
// BMI CALCULATOR
// Adult BMI categories are only a general screening guide.
// ==========================================

const bmiButton = document.getElementById("bmiButton");

bmiButton?.addEventListener("click", () => {
  const height = Number(document.getElementById("bmiHeight").value);
  const weight = Number(document.getElementById("bmiWeight").value);
  const result = document.getElementById("bmiResult");

  if (!height || !weight || height < 80 || height > 250 || weight < 20 || weight > 350) {
    result.textContent = "Please enter a valid height and weight.";
    return;
  }

  const heightMetres = height / 100;
  const bmi = weight / (heightMetres * heightMetres);

  let category = "";

  if (bmi < 18.5) {
    category = "Below the usual adult reference range";
  } else if (bmi < 25) {
    category = "Within the usual adult reference range";
  } else if (bmi < 30) {
    category = "Above the usual adult reference range";
  } else {
    category = "High adult BMI range";
  }

  result.innerHTML =
    `<strong>Your BMI: ${bmi.toFixed(1)}</strong><br>${category}.` +
    `<br><small>BMI is a screening measure, not a diagnosis. Adult categories may not apply to everyone.</small>`;
});

// ==========================================
// DAILY CALORIE ESTIMATOR
// Uses the Mifflin-St Jeor equation.
// This is an estimate, not a diet prescription.
// ==========================================

const calorieButton = document.getElementById("calorieButton");

calorieButton?.addEventListener("click", () => {
  const age = Number(document.getElementById("calAge").value);
  const height = Number(document.getElementById("calHeight").value);
  const weight = Number(document.getElementById("calWeight").value);
  const sex = document.getElementById("calSex").value;
  const activity = Number(document.getElementById("activity").value);
  const result = document.getElementById("calorieResult");

  if (
    !age || !height || !weight ||
    age < 15 || age > 100 ||
    height < 100 || height > 250 ||
    weight < 20 || weight > 350
  ) {
    result.textContent = "Please enter valid age, height and weight values.";
    return;
  }

  const sexAdjustment = sex === "male" ? 5 : -161;

  const bmr =
    (10 * weight) +
    (6.25 * height) -
    (5 * age) +
    sexAdjustment;

  const maintenance = Math.round(bmr * activity);

  result.innerHTML =
    `<strong>Estimated maintenance: ${maintenance.toLocaleString("en-IN")} kcal/day</strong>` +
    `<br>Estimated resting energy: ${Math.round(bmr).toLocaleString("en-IN")} kcal/day.` +
    `<br><small>This is a rough estimate. Individual needs vary. Seek qualified advice for a personalised nutrition plan.</small>`;
});

// ==========================================
// WATER TRACKER
// Saves count for the current local date.
// ==========================================

const waterCount = document.getElementById("waterCount");
const waterProgress = document.getElementById("waterProgress");
const addWater = document.getElementById("addWater");
const removeWater = document.getElementById("removeWater");
const resetWater = document.getElementById("resetWater");

function localDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWaterKey() {
  return `proFitnessWater-${localDateKey()}`;
}

let glasses = Number(localStorage.getItem(getWaterKey())) || 0;
glasses = Math.max(0, Math.min(8, glasses));

function renderWater() {
  waterCount.textContent = glasses;
  waterProgress.style.width = `${(glasses / 8) * 100}%`;
  localStorage.setItem(getWaterKey(), String(glasses));
}

addWater?.addEventListener("click", () => {
  glasses = Math.min(8, glasses + 1);
  renderWater();
});

removeWater?.addEventListener("click", () => {
  glasses = Math.max(0, glasses - 1);
  renderWater();
});

resetWater?.addEventListener("click", () => {
  glasses = 0;
  renderWater();
});

renderWater();

// ==========================================
// WORKOUT PLANNER
// Sample plan only. User selection is saved
// in this browser using localStorage.
// ==========================================

const daySelector = document.getElementById("daySelector");
const plannerOutput = document.getElementById("plannerOutput");
const saveWorkout = document.getElementById("saveWorkout");
const clearWorkout = document.getElementById("clearWorkout");
const workoutMessage = document.getElementById("workoutMessage");

const workoutSuggestions = [
  "Full body strength",
  "Cardio and core",
  "Upper body",
  "Lower body",
  "Mobility and light cardio",
  "Full body or favourite activity",
  "Rest and recovery"
];

function getSelectedDays() {
  return [...daySelector.querySelectorAll("input:checked")].map(input => input.value);
}

function renderWorkoutPlan() {
  const selected = getSelectedDays();

  if (selected.length === 0) {
    plannerOutput.textContent = "Choose your training days to create a sample weekly plan.";
    return;
  }

  const allDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const chosen = allDays.filter(day => selected.includes(day));

  plannerOutput.innerHTML = chosen.map(day => {
    const index = allDays.indexOf(day);
    return `<div class="plan-row"><strong>${day}</strong><span>${workoutSuggestions[index]}</span></div>`;
  }).join("");
}

daySelector?.querySelectorAll("input").forEach(input => {
  input.addEventListener("change", renderWorkoutPlan);
});

const savedWorkout = JSON.parse(localStorage.getItem("proFitnessWorkout") || "[]");

daySelector?.querySelectorAll("input").forEach(input => {
  input.checked = savedWorkout.includes(input.value);
});

renderWorkoutPlan();

saveWorkout?.addEventListener("click", () => {
  const selected = getSelectedDays();

  if (selected.length === 0) {
    workoutMessage.textContent = "Choose at least one training day.";
    return;
  }

  localStorage.setItem("proFitnessWorkout", JSON.stringify(selected));
  workoutMessage.textContent = "Your plan is saved on this device.";
});

clearWorkout?.addEventListener("click", () => {
  daySelector.querySelectorAll("input").forEach(input => {
    input.checked = false;
  });

  localStorage.removeItem("proFitnessWorkout");
  workoutMessage.textContent = "Plan cleared.";
  renderWorkoutPlan();
});

// Add planner row styling
const plannerStyle = document.createElement("style");
plannerStyle.textContent = `
.plan-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
}
.plan-row strong { color: var(--green); }
.plan-row span { text-align: right; }
@media(max-width:500px) {
  .plan-row { flex-direction: column; gap: 3px; }
  .plan-row span { text-align: left; }
}
`;
document.head.appendChild(plannerStyle);

// ==========================================
// FREE GYM VISIT BOOKING
// Opens WhatsApp with form details.
// Does not confirm a booking automatically.
// ==========================================

const bookingForm = document.getElementById("bookingForm");
const visitDate = document.getElementById("visitDate");

// Prevent selecting a past date
if (visitDate) {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  visitDate.min = localToday;
}

bookingForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const name = document.getElementById("visitName").value.trim();
  const phone = document.getElementById("visitPhone").value.trim();
  const date = visitDate.value;
  const time = document.getElementById("visitTime").value;
  const goal = document.getElementById("visitGoal").value;

  const message =
    `Hello Pro Fitness! I would like to request a gym visit.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Preferred date: ${date}\n` +
    `Preferred time: ${time}\n` +
    `Fitness goal: ${goal}\n\n` +
    `Please confirm availability. Thank you!`;

  sendWhatsApp(message);
});

// ==========================================
// PERSONAL TRAINING ENQUIRY
// ==========================================

document.querySelectorAll('a[href="#booking"]').forEach(link => {
  link.addEventListener("click", () => {
    // Booking section is the shared enquiry point.
  });
});

// ==========================================
// FAQ: KEEP ONE OPEN AT A TIME
// ==========================================

const faqItems = document.querySelectorAll(".faq-list details");

faqItems.forEach(item => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

// ==========================================
// BACK TO TOP
// ==========================================

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backTop.classList.add("show");
  } else {
    backTop.classList.remove("show");
  }
}, { passive: true });

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(
  ".section, .image-card, .membership-card, .facility-item, .tool-card, .story-panel, .community-card, .enquiry-form"
);

revealElements.forEach(element => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// ==========================================
// BASIC ERROR-FREE STARTUP CHECK
// ==========================================

console.log("Pro Fitness website loaded successfully.");
