
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Automatically update copyright year
document.getElementById("year").textContent =
  new Date().getFullYear();

// WhatsApp membership enquiry
const enquiryForm = document.getElementById("enquiryForm");

enquiryForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const goal = document.getElementById("goal").value;
  const plan = document.getElementById("plan").value;

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  const message =
    `Hello Pro Fitness! I want to enquire about gym membership.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Fitness Goal: ${goal}\n` +
    `Membership: ${plan}\n\n` +
    `Please share the membership fees and details.`;

  const whatsappURL =
    "https://wa.me/917975222680?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank", "noopener");
});
