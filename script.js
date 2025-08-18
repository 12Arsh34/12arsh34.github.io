const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = ` <link rel="stylesheet" href="style.css"><nav class="navbar">
  <a href="index.html" class="logo">Arsh Kazi</a>
  <div class="mobile-menu-toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="skills.html">Skills</a></li>
    <li><a href="projects.html">Projects</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>`

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

        // Mobile menu functionality
        const mobileToggle = shadowRoot.querySelector('.mobile-menu-toggle');
        const navLinksContainer = shadowRoot.querySelector('.nav-links');

        if (mobileToggle && navLinksContainer) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navLinksContainer.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                });
            });
        }
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

// 3. Enhanced scroll animations with Intersection Observer
const animateOnScroll = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Add staggered animation delay for skill items
        if (element.classList.contains('skill-item')) {
          const index = Array.from(element.parentNode.children).indexOf(element);
          element.style.animationDelay = `${index * 0.1}s`;
          element.classList.add('animate-fade-in-up');
        }

        // Add different animations for different elements
        if (element.classList.contains('project-card')) {
          const index = Array.from(element.parentNode.children).indexOf(element);
          element.style.animationDelay = `${index * 0.2}s`;
          element.classList.add('animate-fade-in-up');
        }

        if (element.id === 'hero') {
          element.classList.add('animate-fade-in-up');
        }

        if (element.id === 'bio') {
          element.classList.add('animate-fade-in-left');
        }

        if (element.id === 'contact') {
          element.classList.add('animate-fade-in-right');
        }

        // Stop observing once animated
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const elementsToAnimate = document.querySelectorAll('.skill-item, .project-card, #hero, #bio, #contact');
  elementsToAnimate.forEach(el => observer.observe(el));
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animateOnScroll);

// 4. Enhanced scroll progress bar with navbar effects
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const navbar = document.querySelector('.navbar');
  const progressBar = document.getElementById("progress-bar");

  // Progress bar
  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  // Navbar scroll effects
  if (navbar) {
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }

  lastScrollTop = scrollTop;
});

// 5. Parallax effect for hero section
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// 6. Typing animation for hero text
const typeWriter = (element, text, speed = 100) => {
  let i = 0;
  element.innerHTML = '';

  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
};

// Initialize typing animation when page loads
window.addEventListener('load', () => {
  const heroH2 = document.querySelector('#hero h2');
  if (heroH2) {
    const originalText = heroH2.textContent;
    typeWriter(heroH2, originalText, 80);
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

// 9. Add ripple effect animation CSS
const rippleCSS = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  border: 1px solid var(--success);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border: 1px solid var(--error);
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// 10. Add smooth page transitions
const addPageTransitions = () => {
  // Add loading animation
  const body = document.body;
  body.style.opacity = '0';
  body.style.transition = 'opacity 0.5s ease-in-out';

  window.addEventListener('load', () => {
    body.style.opacity = '1';
  });

  // Add click animations to buttons and links
  const clickableElements = document.querySelectorAll('a, button, .project-card, .skill-item');
  clickableElements.forEach(element => {
    element.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 217, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// Initialize page transitions
document.addEventListener('DOMContentLoaded', addPageTransitions);

// 11. Back to top button
const createBackToTopButton = () => {
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--primary-accent), var(--secondary-accent));
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  `;

  document.body.appendChild(backToTop);

  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  // Smooth scroll to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Hover effects
  backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'scale(1.1)';
    backToTop.style.boxShadow = 'var(--shadow-glow)';
  });

  backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'scale(1)';
    backToTop.style.boxShadow = 'var(--shadow-lg)';
  });
};

// Initialize back to top button
createBackToTopButton();

// 12. Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  }

  // Arrow keys for navigation
  if (e.key === 'ArrowUp' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (e.key === 'ArrowDown' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// 13. Enhanced loading experience
const showLoadingIndicator = () => {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  `;

  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--primary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  `;

  const loaderCSS = `
    .loader-content {
      text-align: center;
      color: var(--primary-text);
    }

    .loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 217, 255, 0.3);
      border-top: 3px solid var(--primary-accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = loaderCSS;
  document.head.appendChild(style);

  document.body.appendChild(loader);

  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        style.remove();
      }, 500);
    }, 500);
  });
};

// Show loading indicator
showLoadingIndicator();

// 14. Performance optimizations
const optimizePerformance = () => {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Debounce scroll events
  let scrollTimeout;
  const debouncedScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Scroll-dependent operations here
    }, 16); // ~60fps
  };

  // Throttle resize events
  let resizeTimeout;
  const throttledResize = () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        // Resize-dependent operations here
        resizeTimeout = null;
      }, 250);
    }
  };

  window.addEventListener('scroll', debouncedScroll, { passive: true });
  window.addEventListener('resize', throttledResize, { passive: true });

  // Preload critical pages
  const preloadPages = ['skills.html', 'projects.html', 'contact.html'];
  preloadPages.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
optimizePerformance();

// 15. Error handling and analytics
const initErrorHandling = () => {
  window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an analytics service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an analytics service
  });
};

initErrorHandling();

// 16. Service Worker for caching (if needed)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment the following lines if you want to implement a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}
