document.addEventListener("DOMContentLoaded", () => {

  // BASIC HELPERS
  const $ = (id) => document.getElementById(id);

  const getLocal = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const setLocal = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  // CURRENT YEAR
  $("year").textContent = new Date().getFullYear();

  // MOBILE NAVIGATION
  const menuToggle = $("menuToggle");
  const mainNav = $("mainNav");

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // BACK TO TOP
  const backTop = $("backTop");

  window.addEventListener("scroll", () => {
    backTop.classList.toggle("visible", window.scrollY > 450);
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // DATE LIMITS
  const today = new Date();
  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  $("visitDate").min = localDate;
  $("progressDate").value = localDate;
  $("progressDate").max = localDate;
  $("visitDate").value = localDate;

  // WHATSAPP HELPER
  const sendWhatsApp = (message) => {
    const url = "https://wa.me/917975222680?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  };

  // MEMBERSHIP ENQUIRY
  document.querySelectorAll(".plan-button").forEach(button => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;

      sendWhatsApp(
        `Hello Pro Fitness! I am interested in the ${plan}. Please share the current price, facilities and details.`
      );
    });
  });

  // VISIT BOOKING FORM
  $("bookingForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("visitName").value.trim();
    const phone = $("visitPhone").value.trim();
    const date = $("visitDate").value;
    const time = $("visitTime").value;
    const goal = $("visitGoal").value;

    if (!name || !phone || !date || !time) {
      alert("Please complete all required fields.");
      return;
    }

    const message =
      `Hello Pro Fitness!\n\n` +
      `I would like to request a gym visit.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Preferred date: ${date}\n` +
      `Preferred time: ${time}\n` +
      `Fitness goal: ${goal}\n\n` +
      `Please confirm availability. Thank you!`;

    sendWhatsApp(message);
  });

  // BMI CALCULATOR
  $("bmiButton").addEventListener("click", () => {
    const height = Number($("bmiHeight").value);
    const weight = Number($("bmiWeight").value);
    const result = $("bmiResult");

    if (
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      height < 80 ||
      height > 250 ||
      weight < 20 ||
      weight > 350
    ) {
      result.textContent = "Please enter a valid height (80–250 cm) and weight (20–350 kg).";
      return;
    }

    const heightMetres = height / 100;
    const bmi = weight / (heightMetres * heightMetres);

    let category;

    if (bmi < 18.5) {
      category = "Below the standard adult BMI range";
    } else if (bmi < 25) {
      category = "Within the standard adult BMI range";
    } else if (bmi < 30) {
      category = "Above the standard adult BMI range";
    } else {
      category = "High adult BMI range";
    }

    result.innerHTML =
      `<strong>Your BMI: ${bmi.toFixed(1)}</strong><br>${category}.` +
      `<br><small>BMI is a screening measure, not a diagnosis.</small>`;
  });

  // CALORIE ESTIMATOR
  $("calorieButton").addEventListener("click", () => {
    const age = Number($("calAge").value);
    const height = Number($("calHeight").value);
    const weight = Number($("calWeight").value);
    const sex = $("calSex").value;
    const activity = Number($("activity").value);
    const result = $("calorieResult");

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      age < 15 || age > 100 ||
      height < 100 || height > 250 ||
      weight < 20 || weight > 350
    ) {
      result.textContent = "Please enter valid age, height and weight.";
      return;
    }

    // Mifflin-St Jeor estimate
    let bmr;

    if (sex === "male") {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const maintenance = Math.round(bmr * activity);

    result.innerHTML =
      `<strong>Estimated maintenance: ${maintenance} kcal/day</strong><br>` +
      `Estimated resting energy: ${Math.round(bmr)} kcal/day.<br>` +
      `<small>This is a rough estimate, not a personalised diet prescription. Not intended for people under 18 or during pregnancy.</small>`;
  });

  // WATER TRACKER
  const waterKey = "proFitnessWater_" + localDate;
  let waterCount = getLocal(waterKey, 0);

  const renderWater = () => {
    waterCount = Math.max(0, Math.min(8, waterCount));

    $("waterCount").textContent = waterCount;
    $("waterProgress").style.width = (waterCount / 8 * 100) + "%";

    setLocal(waterKey, waterCount);
  };

  $("addWater").addEventListener("click", () => {
    waterCount++;
    renderWater();
  });

  $("removeWater").addEventListener("click", () => {
    waterCount--;
    renderWater();
  });

  $("resetWater").addEventListener("click", () => {
    waterCount = 0;
    renderWater();
  });

  renderWater();

  // WEEKLY WORKOUT PLANNER
  const daySelector = $("daySelector");
  const plannerOutput = $("plannerOutput");

  const workoutMap = {
    Monday: "Upper body training",
    Tuesday: "Cardio and core",
    Wednesday: "Lower body training",
    Thursday: "Recovery or light mobility",
    Friday: "Full body training",
    Saturday: "Light cardio and stretching",
    Sunday: "Rest and recovery"
  };

  const selectedDays = () => {
    return [...daySelector.querySelectorAll("input:checked")]
      .map(input => input.value);
  };

  const renderWorkout = () => {
    const days = selectedDays();

    if (days.length === 0) {
      plannerOutput.textContent =
        "Choose your training days to create a sample weekly plan.";
      return;
    }

    plannerOutput.innerHTML =
      "<strong>Your sample weekly plan</strong><ul>" +
      days.map(day =>
        `<li><strong>${day}:</strong> ${workoutMap[day]}</li>`
      ).join("") +
      "</ul>";
  };

  daySelector.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", renderWorkout);
  });

  $("saveWorkout").addEventListener("click", () => {
    const days = selectedDays();

    if (days.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    const saved = setLocal("proFitnessWorkoutPlan", days);

    $("workoutMessage").textContent = saved
      ? "Your plan has been saved on this device!"
      : "Could not save the plan in this browser.";
  });

  $("clearWorkout").addEventListener("click", () => {
    daySelector.querySelectorAll("input").forEach(input => {
      input.checked = false;
    });

    try {
      localStorage.removeItem("proFitnessWorkoutPlan");
    } catch {}

    $("workoutMessage").textContent = "";
    renderWorkout();
  });

  const savedWorkout = getLocal("proFitnessWorkoutPlan", []);

  daySelector.querySelectorAll("input").forEach(input => {
    input.checked = savedWorkout.includes(input.value);
  });

  renderWorkout();

  // FITNESS ROUTINE GENERATOR
  const routines = {
    general: {
      beginner: [
        ["Day 1", "Full body basics and light cardio"],
        ["Day 2", "Rest or gentle walking"],
        ["Day 3", "Full body basics"],
        ["Day 4", "Rest and mobility"],
        ["Day 5", "Light cardio and core"],
        ["Day 6", "Optional easy activity"],
        ["Day 7", "Rest"]
      ],
      intermediate: [
        ["Day 1", "Upper body"],
        ["Day 2", "Lower body"],
        ["Day 3", "Cardio and core"],
        ["Day 4", "Rest"],
        ["Day 5", "Full body"],
        ["Day 6", "Light cardio"],
        ["Day 7", "Rest"]
      ],
      advanced: [
        ["Day 1", "Upper body strength"],
        ["Day 2", "Lower body strength"],
        ["Day 3", "Conditioning"],
        ["Day 4", "Upper body volume"],
        ["Day 5", "Lower body volume"],
        ["Day 6", "Optional easy cardio"],
        ["Day 7", "Rest"]
      ]
    },

    strength: {
      beginner: [
        ["Day 1", "Basic squat and push movements"],
        ["Day 2", "Rest"],
        ["Day 3", "Basic pull movements"],
        ["Day 4", "Rest"],
        ["Day 5", "Light full body technique"],
        ["Day 6", "Walking"],
        ["Day 7", "Rest"]
      ],
      intermediate: [
        ["Day 1", "Upper body strength"],
        ["Day 2", "Lower body strength"],
        ["Day 3", "Recovery"],
        ["Day 4", "Upper body technique"],
        ["Day 5", "Lower body technique"],
        ["Day 6", "Light cardio"],
        ["Day 7", "Rest"]
      ],
      advanced: [
        ["Day 1", "Upper body strength"],
        ["Day 2", "Lower body strength"],
        ["Day 3", "Recovery"],
        ["Day 4", "Upper body volume"],
        ["Day 5", "Lower body volume"],
        ["Day 6", "Optional conditioning"],
        ["Day 7", "Rest"]
      ]
    },

    muscle: {
      beginner: [
        ["Day 1", "Full body technique"],
        ["Day 2", "Rest"],
        ["Day 3", "Full body technique"],
        ["Day 4", "Rest"],
        ["Day 5", "Full body technique"],
        ["Day 6", "Easy walking"],
        ["Day 7", "Rest"]
      ],
      intermediate: [
        ["Day 1", "Chest and triceps"],
        ["Day 2", "Back and biceps"],
        ["Day 3", "Legs"],
        ["Day 4", "Rest"],
        ["Day 5", "Shoulders and core"],
        ["Day 6", "Optional light cardio"],
        ["Day 7", "Rest"]
      ],
      advanced: [
        ["Day 1", "Push training"],
        ["Day 2", "Pull training"],
        ["Day 3", "Leg training"],
        ["Day 4", "Recovery"],
        ["Day 5", "Upper body"],
        ["Day 6", "Lower body"],
        ["Day 7", "Rest"]
      ]
    },

    endurance: {
      beginner: [
        ["Day 1", "Easy walking"],
        ["Day 2", "Rest"],
        ["Day 3", "Easy cycling or walking"],
        ["Day 4", "Rest"],
        ["Day 5", "Short easy cardio"],
        ["Day 6", "Mobility"],
        ["Day 7", "Rest"]
      ],
      intermediate: [
        ["Day 1", "Steady cardio"],
        ["Day 2", "Light strength"],
        ["Day 3", "Interval practice"],
        ["Day 4", "Recovery"],
        ["Day 5", "Steady cardio"],
        ["Day 6", "Light activity"],
        ["Day 7", "Rest"]
      ],
      advanced: [
        ["Day 1", "Cardio intervals"],
        ["Day 2", "Strength training"],
        ["Day 3", "Steady endurance"],
        ["Day 4", "Recovery"],
        ["Day 5", "Tempo cardio"],
        ["Day 6", "Easy endurance"],
        ["Day 7", "Rest"]
      ]
    },

    fatloss: {
      beginner: [
        ["Day 1", "Full body basics"],
        ["Day 2", "Easy walking"],
        ["Day 3", "Full body basics"],
        ["Day 4", "Rest"],
        ["Day 5", "Light cardio"],
        ["Day 6", "Easy walking"],
        ["Day 7", "Rest"]
      ],
      intermediate: [
        ["Day 1", "Full body strength"],
        ["Day 2", "Moderate cardio"],
        ["Day 3", "Full body strength"],
        ["Day 4", "Recovery"],
        ["Day 5", "Full body strength"],
        ["Day 6", "Moderate cardio"],
        ["Day 7", "Rest"]
      ],
      advanced: [
        ["Day 1", "Strength training"],
        ["Day 2", "Cardio intervals"],
        ["Day 3", "Strength training"],
        ["Day 4", "Recovery"],
        ["Day 5", "Strength training"],
        ["Day 6", "Steady cardio"],
        ["Day 7", "Rest"]
      ]
    }
  };

  $("generateRoutine").addEventListener("click", () => {
    const goal = $("goalSelect").value;
    const experience = $("experienceSelect").value;

    const routine = routines[goal]?.[experience];

    if (!routine) {
      $("routineOutput").textContent = "Unable to generate a routine.";
      return;
    }

    $("routineOutput").innerHTML =
      "<strong>Your sample 7-day routine</strong>" +
      routine.map(day =>
        `<div class="routine-day"><strong>${day[0]}</strong>${day[1]}</div>`
      ).join("");
  });

  // EXERCISE LIBRARY SEARCH AND FILTER
  const exerciseSearch = $("exerciseSearch");
  const exerciseFilter = $("exerciseFilter");
  const exerciseCards = [...document.querySelectorAll(".exercise-card")];

  const filterExercises = () => {
    const search = exerciseSearch.value.toLowerCase().trim();
    const group = exerciseFilter.value;
    let visibleCount = 0;

    exerciseCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.group;

      const matchesSearch = name.includes(search);
      const matchesGroup = group === "all" || group === category;

      const visible = matchesSearch && matchesGroup;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    $("exerciseEmpty").hidden = visibleCount !== 0;
  };

  exerciseSearch.addEventListener("input", filterExercises);
  exerciseFilter.addEventListener("change", filterExercises);

  // DAILY HABITS
  const habitDateKey = "proFitnessHabits_" + localDate;
  const savedHabits = getLocal(habitDateKey, []);

  $("habitDateLabel").textContent =
    "TODAY'S CHECKLIST · " + localDate;

  const habitInputs = [
    ...document.querySelectorAll("#habitList input")
  ];

  const renderHabits = () => {
    let completed = 0;

    habitInputs.forEach(input => {
      input.checked = savedHabits.includes(input.value);

      if (input.checked) completed++;
    });

    const percentage = (completed / habitInputs.length) * 100;

    $("habitProgressText").textContent =
      `${completed} / ${habitInputs.length} completed`;

    $("habitProgressBar").style.width = percentage + "%";

    setLocal(habitDateKey, savedHabits);
  };

  habitInputs.forEach(input => {
    input.addEventListener("change", () => {
      const index = savedHabits.indexOf(input.value);

      if (input.checked && index === -1) {
        savedHabits.push(input.value);
      } else if (!input.checked && index !== -1) {
        savedHabits.splice(index, 1);
      }

      renderHabits();
    });
  });

  $("resetHabits").addEventListener("click", () => {
    savedHabits.length = 0;
    renderHabits();
  });

  renderHabits();

  // WEIGHT PROGRESS TRACKER
  const progressKey = "proFitnessProgress";
  let progressEntries = getLocal(progressKey, []);

  const renderProgress = () => {
    progressEntries.sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    $("progressEntries").innerHTML = "";

    if (progressEntries.length === 0) {
      $("progressSummary").textContent =
        "No entries yet. Add your first entry.";
      return;
    }

    const latest = progressEntries[0];

    $("progressSummary").innerHTML =
      `<strong>Latest entry: ${latest.weight} kg</strong><br>` +
      `Recorded on ${latest.date}<br>` +
      `${progressEntries.length} saved entries`;

    progressEntries.forEach((entry, index) => {
      const li = document.createElement("li");

      const details = document.createElement("span");
      details.textContent = `${entry.date} — ${entry.weight} kg`;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "DELETE";
      remove.setAttribute("aria-label", `Delete entry from ${entry.date}`);

      remove.addEventListener("click", () => {
        progressEntries.splice(index, 1);
        setLocal(progressKey, progressEntries);
        renderProgress();
      });

      li.append(details, remove);
      $("progressEntries").appendChild(li);
    });
  };

  $("progressForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const date = $("progressDate").value;
    const weight = Number($("progressWeight").value);

    if (
      !date ||
      date > localDate ||
      !Number.isFinite(weight) ||
      weight < 20 ||
      weight > 350
    ) {
      alert("Please enter a valid date and weight.");
      return;
    }

    progressEntries.push({
      date,
      weight: Number(weight.toFixed(1))
    });

    setLocal(progressKey, progressEntries);

    $("progressWeight").value = "";

    renderProgress();
  });

  $("clearProgress").addEventListener("click", () => {
    if (!progressEntries.length) return;

    if (confirm("Delete all saved progress entries?")) {
      progressEntries = [];
      setLocal(progressKey, progressEntries);
      renderProgress();
    }
  });

  renderProgress();

});
