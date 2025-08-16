const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `<nav class="nav-bar">
  <div class="logo">MyPortfolio</div>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="skills.html">Skills</a></li>
    <li><a href="projects.html">Projects</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>`;

// My Custom Header
class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

        // Highlight active navbar link inside shadow DOM
        const navLinks = shadowRoot.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            // Compare only the file name part of the URL
            if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
                link.classList.add('active');
            }
        });
    }
}

customElements.define('my-header', Header);

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
