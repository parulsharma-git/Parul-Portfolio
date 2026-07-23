/* ==========================================================================
   PARUL SHARMA — PORTFOLIO
   script.js — preloader, navbar, cursor glow, scroll progress,
   typing effect, scroll reveal (Intersection Observer), stat counters,
   mobile menu, back-to-top. Vanilla JS only, no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* Preloader                                                           */
  /* ------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 500);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ------------------------------------------------------------------ */
  /* Scroll progress bar                                                 */
  /* ------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ------------------------------------------------------------------ */
  /* Navbar: glass on scroll + active section highlight                 */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const backToTop = document.getElementById('backToTop');

  function handleScrollEffects(){
    if (window.scrollY > 40){
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500){
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }

    updateScrollProgress();
  }

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // Active link via IntersectionObserver
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                         */
  /* ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------ */
  /* Cursor glow (desktop only)                                          */
  /* ------------------------------------------------------------------ */
  const cursorGlow = document.getElementById('cursorGlow');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer && cursorGlow){
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow(){
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ------------------------------------------------------------------ */
  /* Typing effect (hero subtitle)                                       */
  /* ------------------------------------------------------------------ */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Aspiring Software Developer',
    'AI Enthusiast',
    'Full-Stack Learner',
    'Building AI Agents with Python'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop(){
    const currentRole = roles[roleIndex];

    if (isDeleting){
      charIndex--;
    } else {
      charIndex++;
    }

    typedTextEl.textContent = currentRole.substring(0, charIndex);

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === currentRole.length){
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0){
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    setTimeout(typeLoop, delay);
  }

  if (typedTextEl){ typeLoop(); }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal animations (Intersection Observer)                   */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-stagger'
  );

  // Assign incremental stagger delay to sibling groups (skills, projects, certs, contact, timeline)
  const staggerGroups = document.querySelectorAll('.skills-grid, .projects-grid, .certs-grid, .contact-grid');
  staggerGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal-stagger');
    children.forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * 0.12}s`);
    });
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Hero stat counters                                                  */
  /* ------------------------------------------------------------------ */
  const statNums = document.querySelectorAll('.stat-num');

  function animateCount(el){
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 30);

    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target){
        clearInterval(timer);
        el.textContent = target;
      }
    }, stepTime);
  }

  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => statObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Footer year                                                         */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl){ yearEl.textContent = new Date().getFullYear(); }

});
