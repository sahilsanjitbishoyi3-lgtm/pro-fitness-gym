
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// Mobile menu
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("active");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

// Close menu after selecting a section
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  });
});

// Current copyright year
document.getElementById("year").textContent = new Date().getFullYear();

// WhatsApp membership enquiry
document.getElementById("enquiryForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const goal = document.getElementById("goal").value;
  const plan = document.getElementById("plan").value;

  if (!name || !goal || !plan || !/^[0-9]{10}$/.test(phone)) {
    alert("Please fill in all fields and enter a valid 10-digit phone number.");
    return;
  }

  const message = `Hello Pro Fitness! I would like to enquire about membership.

Name: ${name}
Phone: ${phone}
Fitness Goal: ${goal}
Membership: ${plan}

Please share the membership fees and details.`;

  const whatsappLink =
    "https://wa.me/917975222680?text=" +
    encodeURIComponent(message);

  window.open(whatsappLink, "_blank", "noopener,noreferrer");
});
