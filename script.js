
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const open = navigation.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#navigation a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// FAQ accordion
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const current = button.closest(".faq-item");
    const wasOpen = current.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(item => {
      item.classList.remove("open");
      item.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      current.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });

  button.setAttribute("aria-expanded", "false");
});

// Membership selection
document.querySelectorAll("[data-plan]").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("plan").value = link.dataset.plan;
  });
});

// Footer year
document.getElementById("year").textContent =
  new Date().getFullYear();

// WhatsApp membership enquiry
document.getElementById("joinForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const goal = document.getElementById("goal").value;
  const plan = document.getElementById("plan").value;

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  const message =
`Hello Pro Fitness!

I am interested in joining your gym.

Name: ${name}
Phone: ${phone}
Fitness Goal: ${goal}
Membership: ${plan}

Please share the membership fees and details.

Thank you!`;

  const whatsappURL =
    "https://wa.me/917975222680?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});
