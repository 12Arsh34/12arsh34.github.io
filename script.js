

const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = "<nav class="navbar">
  <div class="logo">MyPortfolio</div>
  <ul class="nav-links">
    <li>><a href="index.html">Home</a></li>
    <li><a href="skills.html">Skills</a></li>
    <li><a href="projects.html">Projects</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>"

<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
<header class="text-gray-700 body-font">
<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
  <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
    <span class="ml-3 text-xl">Manan Bhanushali</span>
  </a>
  <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
    <a href="https://bhanushalimanan.github.io/" class="mr-5 hover:text-gray-900">Home</a>
    <a href="https://bhanushalimanan.github.io/projects" class="mr-5 hover:text-gray-900">Projects</a>
    <a href="https://bhanushalimanan.github.io/download" class="mr-5 hover:text-gray-900">Download</a>
  </nav>
</div>
</header>
`
// 1. Highlight active navbar link
// My Custom Header
class Header extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('my-header', Header);
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// 2. Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// 3. Skills fade-in animation on scroll
const skills = document.querySelectorAll('.skill-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.3 });

skills.forEach(skill => observer.observe(skill));

// 4. Scroll progress bar
window.addEventListener("scroll", () => {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  }
});

// 5. Contact form with Formspree (and validation)
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      status.textContent = "⚠️ Please fill in all fields before submitting.";
      status.style.color = "red";
      return;
    }
    if (!/^[^ ]+@[^ ]+\.[a-z]{2,}$/i.test(email)) {
      status.textContent = "⚠️ Please enter a valid email address.";
      status.style.color = "red";
      return;
    }

    // Submit to Formspree
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = "✅ Thanks for your message! I’ll get back to you soon.";
        status.style.color = "lightgreen";
        form.reset();
      } else {
        status.textContent = "⚠️ Oops! Something went wrong. Please try again.";
        status.style.color = "red";
      }
    } catch (error) {
      status.textContent = "⚠️ Network error. Please try later.";
      status.style.color = "red";
    }
  });
} 


