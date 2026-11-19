/**
 * SATYAM SAMANTA | PORTFOLIO CORE ENGINE
 * High-performance, zero-dependency interactive application
 * Features: Neural Particle Canvas, 3D Tilt Glare, Parallax Engine,
 * Cyber Terminal, Command Palette (Cmd+K), Web Audio SFX, Toast Engine.
 */

'use strict';

(function() {
  // =========================================================================
  // 1. STATE & ENVIRONMENT CONFIGURATION
  // =========================================================================
  const state = {
    theme: localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
    soundEnabled: localStorage.getItem('portfolio-sound') === 'true',
    activeFilter: 'all',
    terminalBooted: false,
    audioCtx: null,
    pointerFine: window.matchMedia('(pointer: fine)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const DOM = {
    root: document.documentElement,
    body: document.body,
    navbar: document.getElementById('navbar'),
    progressBar: document.getElementById('scroll-progress-bar'),
    themeToggle: document.getElementById('theme-toggle'),
    audioToggle: document.getElementById('audio-toggle'),
    paletteOpenBtn: document.getElementById('palette-open-btn'),
    commandPalette: document.getElementById('command-palette'),
    paletteBackdrop: document.getElementById('palette-backdrop'),
    paletteInput: document.getElementById('palette-input'),
    paletteResults: document.getElementById('palette-results'),
    mobileMenu: document.getElementById('mobile-menu'),
    mobileMenuBackdrop: document.getElementById('mobile-menu-backdrop'),
    navToggle: document.getElementById('nav-toggle'),
    mobileMenuClose: document.getElementById('mobile-menu-close'),
    navLinks: document.querySelectorAll('.desktop-nav .nav-link'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    heroCanvas: document.getElementById('hero-canvas'),
    cursorDot: document.querySelector('.cursor-dot'),
    cursorAura: document.querySelector('.cursor-aura'),
    terminalScreen: document.getElementById('terminal-screen'),
    terminalHistory: document.getElementById('terminal-history'),
    terminalInput: document.getElementById('terminal-input'),
    terminalChips: document.querySelectorAll('.chip-btn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    projectCards: document.querySelectorAll('.project-card'),
    projectModal: document.getElementById('project-modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalContent: document.getElementById('modal-content'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    contactForm: document.getElementById('contact-form'),
    formSubmit: document.getElementById('form-submit'),
    formStatus: document.getElementById('form-status'),
    charCount: document.getElementById('char-count'),
    toastContainer: document.getElementById('toast-container'),
    copyEmailHero: document.getElementById('copy-email-hero-btn'),
    copyEmailCard: document.getElementById('copy-email-card-btn'),
    copyrightYear: document.getElementById('copyright-year'),
    localTimeHero: document.getElementById('local-time-hero')
  };

  // =========================================================================
  // 2. THEME ENGINE (DARK / LIGHT MODE)
  // =========================================================================
  function initTheme() {
    DOM.root.dataset.theme = state.theme;
    updateThemeUI();

    DOM.themeToggle?.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      DOM.root.dataset.theme = state.theme;
      localStorage.setItem('portfolio-theme', state.theme);
      updateThemeUI();
      soundEngine.play('click');
      showToast(`Switched to ${state.theme} mode`, 'fa-circle-half-stroke');
    });
  }

  function updateThemeUI() {
    const isDark = state.theme === 'dark';
    if (DOM.themeToggle) {
      DOM.themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      DOM.themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      DOM.themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // =========================================================================
  // 3. SYNTHESIZED WEB AUDIO SFX ENGINE (Zero External Audio Files)
  // =========================================================================
  const soundEngine = {
    init() {
      if (!state.soundEnabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext && !state.audioCtx) {
          state.audioCtx = new AudioContext();
        }
      } catch (e) {
        console.warn('AudioContext not supported', e);
      }
    },
    play(type) {
      if (!state.soundEnabled) return;
      if (!state.audioCtx) this.init();
      if (!state.audioCtx) return;

      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const now = state.audioCtx.currentTime;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      switch (type) {
        case 'click':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        case 'hover':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.03);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        case 'command':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        case 'type':
          osc.type = 'square';
          osc.frequency.setValueAtTime(700 + Math.random() * 200, now);
          gain.gain.setValueAtTime(0.012, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          osc.start(now);
          osc.stop(now + 0.02);
          break;
        case 'toast':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
      }
    }
  };

  function initAudioToggle() {
    if (!DOM.audioToggle) return;
    updateAudioUI();

    DOM.audioToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('portfolio-sound', String(state.soundEnabled));
      updateAudioUI();
      if (state.soundEnabled) {
        soundEngine.init();
        soundEngine.play('click');
        showToast('Sound effects enabled', 'fa-volume-high');
      } else {
        showToast('Sound effects muted', 'fa-volume-xmark');
      }
    });
  }

  function updateAudioUI() {
    if (!DOM.audioToggle) return;
    DOM.audioToggle.innerHTML = state.soundEnabled
      ? '<i class="fa-solid fa-volume-high"></i>'
      : '<i class="fa-solid fa-volume-xmark"></i>';
    DOM.audioToggle.classList.toggle('audio-active', state.soundEnabled);
    DOM.audioToggle.setAttribute('aria-label', state.soundEnabled ? 'Mute sound effects' : 'Enable sound effects');
    DOM.audioToggle.title = state.soundEnabled ? 'Mute sound effects' : 'Enable sound effects';
  }

  // =========================================================================
  // 4. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, iconClass = 'fa-circle-check') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    soundEngine.play('toast');

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 3200);
  }

  // =========================================================================
  // 5. INTERACTIVE NEURAL PARTICLE CANVAS ENGINE (Hero Background)
  // =========================================================================
  function initNeuralCanvas() {
    const canvas = DOM.heroCanvas;
    if (!canvas || state.reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    let isVisible = true;
    let animationFrameId;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      createParticles(rect.width, rect.height);
    }

    function createParticles(w, h) {
      particles = [];
      const density = Math.min(Math.floor((w * h) / 14000), 75);
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1.2,
          baseRadius: Math.random() * 2 + 1.2
        });
      }
    }

    function render() {
      if (!isVisible) return;
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      ctx.clearRect(0, 0, w, h);

      const isDark = DOM.root.dataset.theme === 'dark';
      const nodeColor = isDark ? 'rgba(216, 245, 106, 0.7)' : 'rgba(82, 117, 0, 0.7)';
      const lineColor = isDark ? '216, 245, 106' : '82, 117, 0';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Connect synapses
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', debounce(resize, 180));
    resize();
    render();

    // Mouse coordinates on hero
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause canvas when out of viewport
    const heroObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        render();
      }
    }, { threshold: 0.05 });
    heroObserver.observe(canvas.parentElement);
  }

  // =========================================================================
  // 6. 3D TILT & SPECULAR PARALLAX ENGINE (`[data-tilt]`)
  // =========================================================================
  function initTiltEngine() {
    if (!state.pointerFine || state.reducedMotion) return;
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach((card) => {
      let bounds;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width;
        const yPct = mouseY / bounds.height;

        const tiltX = (yPct - 0.5) * -14;
        const tiltY = (xPct - 0.5) * 14;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(8px)`;
        card.style.setProperty('--mouse-x', `${(xPct * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(yPct * 100).toFixed(1)}%`);
      }

      function onMouseLeave() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  // =========================================================================
  // 7. PARALLAX SCROLLING & SCROLLSPY ENGINE
  // =========================================================================
  function initParallaxAndScroll() {
    const parallaxItems = document.querySelectorAll('[data-parallax-speed]');
    const sections = document.querySelectorAll('section[id]');
    let ticking = false;

    function onScroll() {
      const scrollY = window.scrollY;

      // 1. Navbar scrolled style
      DOM.navbar.classList.toggle('scrolled', scrollY > 30);

      // 2. Scroll progress indicator
      const maxScroll = DOM.root.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      DOM.progressBar.style.width = `${progress}%`;

      // 3. Differential Parallax on items
      if (!state.reducedMotion && parallaxItems.length > 0) {
        parallaxItems.forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
          const yOffset = scrollY * speed;
          el.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0)`;
        });
      }

      // 4. Scrollspy Active Navigation
      let currentSectionId = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 150;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      DOM.navLinks.forEach((link) => {
        const target = link.getAttribute('data-section');
        link.classList.toggle('active', target === currentSectionId);
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  }

  // =========================================================================
  // 8. INTERACTIVE CYBER TERMINAL ENGINE (About Section)
  // =========================================================================
  const terminalCommands = {
    help: () => `
      <div class="term-line-output">
        <span class="highlight">AVAILABLE COMMANDS:</span><br>
        &nbsp; : <span class="blue">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: View core tech competencies<br>
        &nbsp; : <span class="blue">projects</span> &nbsp;&nbsp;&nbsp;: List all 8 GitHub projects<br>
        &nbsp; : <span class="blue">metrics</span> &nbsp;&nbsp;&nbsp;&nbsp;: Key numbers & benchmarks<br>
        &nbsp; : <span class="blue">whoami</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Satyam's background & focus<br>
        &nbsp; : <span class="blue">contact</span> &nbsp;&nbsp;&nbsp;&nbsp;: Email, GitHub, and LinkedIn<br>
        &nbsp; : <span class="blue">theme</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Toggle dark / light mode<br>
        &nbsp; : <span class="blue">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Clear terminal console
      </div>
    `,
    skills: () => `
      <div class="term-line-output">
        <span class="highlight">TECHNICAL STACK:</span><br>
        &nbsp;[AI & ML] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PyTorch, TensorFlow, Scikit-Learn, OpenCV, Generative AI, Ensemble ML<br>
        &nbsp;[FRONTEND] &nbsp;&nbsp;&nbsp;React 19, TypeScript, JavaScript, TailwindCSS, HTML5/CSS3<br>
        &nbsp;[BACKEND] &nbsp;&nbsp;&nbsp;&nbsp;FastAPI, Node.js, Deno, PostgreSQL, MySQL, Supabase<br>
        &nbsp;[DEV & IOT] &nbsp;&nbsp;Git, GitHub, Linux, Streamlit, Arduino Uno, C++
      </div>
    `,
    projects: () => `
      <div class="term-line-output">
        <span class="highlight">VERIFIED GITHUB REPOSITORIES:</span><br>
        &nbsp;01. <strong class="highlight">RealityGuard AI</strong> : 97.42% accuracy deepfake detection (PyTorch)<br>
        &nbsp;02. <strong class="highlight">Heart Sound DSS</strong> &nbsp;: 96.38% accuracy phonocardiogram classifier (TensorFlow)<br>
        &nbsp;03. <strong class="highlight">EcoScrap Pickup</strong> : Keras e-waste vision & drone simulation (TypeScript)<br>
        &nbsp;04. <strong class="highlight">SLAY AI</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1,728 combos/req fashion engine (React 19, Deno)<br>
        &nbsp;05. <strong class="highlight">Salary Predictor</strong> : 85.43% accuracy ensemble modeling (48K records)<br>
        &nbsp;06. <strong class="highlight">Chatty Live</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Real-time chat with WebSockets (TypeScript)<br>
        &nbsp;07. <strong class="highlight">Recipe Finder</strong> &nbsp;&nbsp;&nbsp;: Pantry ingredient recipe search (React/JS)<br>
        &nbsp;08. <strong class="highlight">IoT Water Monitor</strong> : Arduino Uno flow sensor telemetry (C++)
      </div>
    `,
    metrics: () => `
      <div class="term-line-output">
        <span class="highlight">KEY BENCHMARKS & RESEARCH:</span><br>
        &nbsp;• Indian Patent Filed: <span class="highlight">EcoScrap Automated Logistics & Vision</span><br>
        &nbsp;• Springer LNNS: <span class="highlight">RealityGuard AI Publication Forthcoming</span><br>
        &nbsp;• Research Paper Completed: <span class="highlight">Heart Sound DSS (96.38% Accuracy)</span><br>
        &nbsp;• RealityGuard Detection Accuracy: <span class="highlight">97.42%</span><br>
        &nbsp;• Heart Sound DSS Accuracy: <span class="highlight">96.38%</span><br>
        &nbsp;• Salary Classification Test Accuracy: <span class="highlight">85.43%</span><br>
        &nbsp;• SLAY AI Outfit Scoring: <span class="highlight">1,728 combinations / req</span><br>
        &nbsp;• Dataset Records Evaluated: <span class="highlight">48,000+</span><br>
        &nbsp;• Chatty Message Propagation: <span class="highlight">&lt; 50ms</span><br>
        &nbsp;• Academic Cumulative GPA: <span class="highlight">8.53 / 10</span>
      </div>
    `,
    whoami: () => `
      <div class="term-line-output">
        Satyam Samanta: Software Engineer (AI & Full-Stack).<br>
        Location: Bengaluru, India.<br>
        Education: B.E. Computer Science & Engineering @ MVJ College of Engineering.<br>
        Focus: Training ML models in PyTorch and shipping production web applications in React and TypeScript.
      </div>
    `,
    contact: () => `
      <div class="term-line-output">
        <span class="highlight">CONTACT CHANNELS:</span><br>
        &nbsp;• Email : <a href="https://mail.google.com/mail/?view=cm&fs=1&to=satyamsamanta10@gmail.com" target="_blank" rel="noopener" class="highlight">satyamsamanta10@gmail.com</a><br>
        &nbsp;• GitHub : <a href="https://github.com/Satyam-123336" target="_blank" class="blue">github.com/Satyam-123336</a><br>
        &nbsp;• LinkedIn: <a href="https://linkedin.com/in/satyamsam10" target="_blank" class="blue">linkedin.com/in/satyamsam10</a>
      </div>
    `,
    theme: () => {
      DOM.themeToggle?.click();
      return `<div class="term-line-output">Theme toggled to: <span class="highlight">${DOM.root.dataset.theme}</span></div>`;
    }
  };

  function initTerminal() {
    if (!DOM.terminalScreen || !DOM.terminalInput) return;

    // Trigger initial boot sequence when in view
    const terminalObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !state.terminalBooted) {
        state.terminalBooted = true;
        runTerminalBootup();
      }
    }, { threshold: 0.2 });
    terminalObserver.observe(DOM.terminalScreen.parentElement);

    // Command submission via Enter
    DOM.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = DOM.terminalInput.value.trim().toLowerCase();
        if (cmd) {
          executeTerminalCommand(cmd);
          DOM.terminalInput.value = '';
          soundEngine.play('command');
        }
      }
    });

    // Chip quick actions
    DOM.terminalChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          executeTerminalCommand(cmd);
          soundEngine.play('command');
        }
      });
    });

    // Keep focus inside input when clicking terminal screen
    DOM.terminalScreen.addEventListener('click', () => {
      DOM.terminalInput.focus();
    });
  }

  function runTerminalBootup() {
    const lines = [
      { text: 'satyam@dev-box:~$ whoami', isCmd: true },
      { text: 'Satyam Samanta: AI and Full-Stack Engineer [Bengaluru, IN]', isCmd: false },
      { text: 'satyam@dev-box:~$ cat summary.txt', isCmd: true },
      { text: 'Computer Science Engineering student building applied ML systems and web apps.', isCmd: false },
      { text: 'Ready. Type "help" or click the pills above to explore.', isCmd: false, highlight: true }
    ];

    let delay = 180;
    lines.forEach((item) => {
      setTimeout(() => {
        const lineEl = document.createElement('div');
        if (item.isCmd) {
          lineEl.className = 'term-line-cmd';
          lineEl.innerHTML = item.text.replace('satyam@dev-box:~$', '<span class="highlight">satyam@dev-box:~$</span>');
        } else {
          lineEl.className = 'term-line-output';
          lineEl.innerHTML = item.highlight ? `<span class="highlight">${item.text}</span>` : item.text;
        }
        DOM.terminalHistory.appendChild(lineEl);
        DOM.terminalScreen.scrollTop = DOM.terminalScreen.scrollHeight;
        soundEngine.play('type');
      }, delay);
      delay += 340;
    });
  }

  function executeTerminalCommand(cmd) {
    if (cmd === 'clear') {
      DOM.terminalHistory.innerHTML = '';
      return;
    }

    const echoLine = document.createElement('div');
    echoLine.className = 'term-line-cmd';
    echoLine.innerHTML = `<span class="highlight">satyam@dev-box:~$</span> ${escapeHTML(cmd)}`;
    DOM.terminalHistory.appendChild(echoLine);

    const handler = terminalCommands[cmd];
    const outputEl = document.createElement('div');
    if (handler) {
      outputEl.innerHTML = handler();
    } else {
      outputEl.className = 'term-line-output';
      outputEl.innerHTML = `command not found: <span style="color:#ef4444;">${escapeHTML(cmd)}</span>. Type <span class="highlight">help</span> for valid commands.`;
    }
    DOM.terminalHistory.appendChild(outputEl);
    DOM.terminalScreen.scrollTop = DOM.terminalScreen.scrollHeight;
  }

  // =========================================================================
  // 9. COMMAND PALETTE (CMD + K / CTRL + K)
  // =========================================================================
  const paletteItems = [
    // Navigation
    { title: 'Jump to About Section', section: 'about', category: 'Navigation', icon: 'fa-user' },
    { title: 'Jump to Selected Projects', section: 'work', category: 'Navigation', icon: 'fa-code' },
    { title: 'Jump to Technical Stack', section: 'skills', category: 'Navigation', icon: 'fa-microchip' },
    { title: 'Jump to Experience & Timeline', section: 'experience', category: 'Navigation', icon: 'fa-briefcase' },
    { title: 'Jump to Contact Section', section: 'contact', category: 'Navigation', icon: 'fa-paper-plane' },
    // Projects (All 8 Verified GitHub Repos)
    { title: 'RealityGuard AI (Deepfake Forensics)', projectId: 'realityguard', category: 'Projects', icon: 'fa-shield-halved' },
    { title: 'Heart Sound DSS (Biomedical Audio AI)', projectId: 'heartsound', category: 'Projects', icon: 'fa-heart-pulse' },
    { title: 'EcoScrap Pickup (Keras Vision & Drone Sim)', projectId: 'ecoscrap', category: 'Projects', icon: 'fa-recycle' },
    { title: 'SLAY AI (Fashion Recommendation Engine)', projectId: 'slayai', category: 'Projects', icon: 'fa-shirt' },
    { title: 'Employee Salary Predictor (ML Classification)', projectId: 'salarypredictor', category: 'Projects', icon: 'fa-chart-line' },
    { title: 'Chatty Live (Real-Time Messaging)', projectId: 'chatty', category: 'Projects', icon: 'fa-comments' },
    { title: 'Recipe Finder App (Pantry Search)', projectId: 'recipefinder', category: 'Projects', icon: 'fa-utensils' },
    { title: 'IoT Water Usage Monitor (Arduino Uno)', projectId: 'watermonitor', category: 'Projects', icon: 'fa-faucet-drip' },
    // Actions
    { title: 'Request Résumé (via Gmail)', action: 'resume', category: 'Actions', icon: 'fa-file-pdf' },
    { title: 'Copy Email to Clipboard', action: 'copy-email', category: 'Actions', icon: 'fa-copy' },
    { title: 'Toggle Dark / Light Theme', action: 'theme', category: 'Actions', icon: 'fa-circle-half-stroke' },
    { title: 'Toggle Audio Effects', action: 'audio', category: 'Actions', icon: 'fa-volume-high' },
    { title: 'Open GitHub Profile', action: 'github', category: 'External Links', icon: 'fa-brands fa-github' },
    { title: 'Open LinkedIn Profile', action: 'linkedin', category: 'External Links', icon: 'fa-brands fa-linkedin' }
  ];

  let selectedPaletteIndex = 0;
  let filteredPaletteItems = [...paletteItems];

  function initCommandPalette() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette(true);
      } else if (e.key === 'Escape' && DOM.commandPalette.classList.contains('open')) {
        togglePalette(false);
      }
    });

    DOM.paletteOpenBtn?.addEventListener('click', () => togglePalette(true));
    DOM.paletteBackdrop?.addEventListener('click', () => togglePalette(false));

    DOM.paletteInput?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filteredPaletteItems = paletteItems.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
      selectedPaletteIndex = 0;
      renderPaletteResults();
    });

    DOM.paletteInput?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedPaletteIndex = (selectedPaletteIndex + 1) % Math.max(1, filteredPaletteItems.length);
        renderPaletteResults();
        soundEngine.play('hover');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedPaletteIndex = (selectedPaletteIndex - 1 + filteredPaletteItems.length) % Math.max(1, filteredPaletteItems.length);
        renderPaletteResults();
        soundEngine.play('hover');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executePaletteItem(filteredPaletteItems[selectedPaletteIndex]);
      }
    });
  }

  function togglePalette(open) {
    if (open) {
      DOM.commandPalette.classList.add('open');
      DOM.commandPalette.setAttribute('aria-hidden', 'false');
      DOM.paletteInput.value = '';
      filteredPaletteItems = [...paletteItems];
      selectedPaletteIndex = 0;
      renderPaletteResults();
      setTimeout(() => DOM.paletteInput.focus(), 60);
      soundEngine.play('command');
    } else {
      DOM.commandPalette.classList.remove('open');
      DOM.commandPalette.setAttribute('aria-hidden', 'true');
    }
  }

  function renderPaletteResults() {
    if (!DOM.paletteResults) return;
    if (filteredPaletteItems.length === 0) {
      DOM.paletteResults.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:0.85rem;">No matching commands found.</div>';
      return;
    }

    let html = '';
    let lastCategory = '';

    filteredPaletteItems.forEach((item, index) => {
      if (item.category !== lastCategory) {
        html += `<div class="palette-group-title">${item.category}</div>`;
        lastCategory = item.category;
      }
      const isActive = index === selectedPaletteIndex;
      html += `
        <div class="palette-item ${isActive ? 'active' : ''}" data-index="${index}" role="option" aria-selected="${isActive}">
          <i class="${item.icon.includes('fa-') ? item.icon : 'fa-solid ' + item.icon} palette-item-icon"></i>
          <span class="palette-item-text">${item.title}</span>
          <span class="palette-item-shortcut">${item.section ? 'JUMP' : item.action ? 'ACTION' : 'PROJECT'}</span>
        </div>
      `;
    });

    DOM.paletteResults.innerHTML = html;

    DOM.paletteResults.querySelectorAll('.palette-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executePaletteItem(filteredPaletteItems[idx]);
      });
    });
  }

  function executePaletteItem(item) {
    if (!item) return;
    togglePalette(false);
    soundEngine.play('click');

    if (item.section) {
      const sectionEl = document.getElementById(item.section);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.projectId) {
      openProjectModal(item.projectId);
    } else if (item.action) {
      switch (item.action) {
        case 'resume':
          window.open('https://mail.google.com/mail/?view=cm&fs=1&to=satyamsamanta10@gmail.com&su=Resume%20Request%20-%20Satyam%20Samanta&body=Hi%20Satyam%2C%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20r%C3%A9sum%C3%A9.%0A%0AThanks!', '_blank', 'noopener,noreferrer');
          break;
        case 'copy-email':
          copyEmailToClipboard();
          break;
        case 'theme':
          DOM.themeToggle?.click();
          break;
        case 'audio':
          DOM.audioToggle?.click();
          break;
        case 'github':
          window.open('https://github.com/Satyam-123336', '_blank');
          break;
        case 'linkedin':
          window.open('https://linkedin.com/in/satyamsam10', '_blank');
          break;
      }
    }
  }

  // =========================================================================
  // 10. PROJECT DETAIL MODAL ENGINE (Verified GitHub Repositories)
  // =========================================================================
  const projectDatabase = {
    realityguard: {
      title: 'RealityGuard AI',
      category: 'Computer Vision & Forensics',
      heroStat: '97.42% Accuracy · Forthcoming in Springer LNNS',
      github: 'https://github.com/Satyam-123336/DeepFake-Detection',
      overview: 'A multimodal deepfake detection pipeline built in PyTorch to identify manipulated facial media by analyzing both visual blending traces and temporal biometric signals. Accepted for publication in Springer Lecture Notes in Networks and Systems (LNNS).',
      architecture: [
        'Accepted for forthcoming publication in Springer Lecture Notes in Networks and Systems (LNNS).',
        'Face detection and bounding box alignment using Multi-Task Cascaded Convolutional Networks (MTCNN).',
        'Lightweight artifact CNN with a ~100KB parameter footprint, optimized for real-time edge CPU inference.',
        'Temporal eye-blink frequency tracking and lip-audio synchronization cross-correlation.',
        'Classical computer vision texture checks using OpenCV to locate blending boundaries and pixel-level inconsistencies.',
        'Deployed with an asynchronous FastAPI backend and an interactive Streamlit testing interface.'
      ],
      stack: ['PyTorch', 'MTCNN', 'OpenCV', 'FastAPI', 'Streamlit', 'Python', 'Scikit-Learn']
    },
    heartsound: {
      title: 'Heart Sound DSS',
      category: 'Biomedical Audio AI & Classification',
      heroStat: '96.38% Accuracy · Research Paper Completed',
      github: 'https://github.com/Satyam-123336/Classifying-the-Heart-Sound-Signals-for-an-efficient-DSS',
      overview: 'An acoustic cardiology decision support pipeline analyzing phonocardiogram (PCG) audio signals to detect cardiovascular abnormalities and assist clinical screening. Full research paper completed.',
      architecture: [
        'Comprehensive research paper completed analyzing PCG textural features and bio-acoustic modeling.',
        'Acoustic signal preprocessing, baseline wander removal, and discrete wavelet denoising on phonocardiogram recordings.',
        'Textural and time-frequency feature extraction utilizing MFCCs, spectral chromagrams, and local binary patterns.',
        'Metaheuristic optimization using Harris Hawks Optimization (HHO) for optimal feature subset selection.',
        'Ensemble deep learning classification architecture combining convolutional neural representations with boosting ensembles.',
        'Achieved 96.38% test classification accuracy on benchmark PhysioNet cardiovascular audio datasets.'
      ],
      stack: ['Python', 'TensorFlow', 'Ensemble ML', 'Librosa', 'Signal Processing', 'Scikit-Learn']
    },
    ecoscrap: {
      title: 'EcoScrap Pickup',
      category: 'E-Waste Recycling & Robotics Simulation',
      heroStat: 'Indian Provisional Patent Filed · 9-Class Vision',
      github: 'https://github.com/Satyam-123336/EcoScrap',
      overview: 'An electronic waste recycling platform connecting households with automated scrap pickup logistics, computer vision classification, and autonomous drone simulation. Indian provisional patent filed.',
      architecture: [
        'Indian Provisional Patent filed for automated e-waste classification and drone pickup logistics architecture.',
        'Image classification pipeline using a custom Keras deep learning model trained across 9 electronic waste categories (PCBs, batteries, hard drives, mobile devices, accessories) with weight estimation.',
        'Autonomous drone dispatch simulation with waypoint telemetry built using CoppeliaSim and Lua scripts.',
        'Interactive 24/7 EcoBot assistant powered by conversational generative AI and LLM integration for recycling guidance.',
        'Full-stack web architecture built with React 18, TypeScript, Express.js, and PostgreSQL (Neon / Drizzle ORM).',
        'Gamified EcoPoints reward system (50 points/kg) with tier badges and carbon offset tracking (0.4 kg CO2 saved per kg recycled).'
      ],
      stack: ['React 18', 'TypeScript', 'Keras / Python', 'Generative AI', 'CoppeliaSim', 'PostgreSQL', 'Express']
    },
    slayai: {
      title: 'SLAY AI E-Commerce Platform',
      category: 'E-Commerce & Edge Computing',
      heroStat: '1,728 Combinations Evaluated / Req',
      github: 'https://github.com/Satyam-123336/SLAY-AI-Fashion-E-Commerce-Official-Application',
      overview: 'A serverless fashion curation application designed to synthesize personalized outfits within user-specified budget and aesthetic parameters.',
      architecture: [
        'Scoring engine evaluating up to 1,728 item permutations per request executed inside Supabase Deno Edge Functions.',
        'Constraint solver ensuring generated outfit combinations remain strictly within customer budget limits.',
        'Concurrent UI rendering powered by React 19 for optimistic cart updates and fast state transitions.',
        'PostgreSQL database backed by Supabase with Row Level Security (RLS) policies.'
      ],
      stack: ['React 19', 'TypeScript', 'Deno', 'Supabase Edge Functions', 'PostgreSQL']
    },
    salarypredictor: {
      title: 'Employee Salary Predictor',
      category: 'Machine Learning & Predictive Modeling',
      heroStat: '85.43% Accuracy on 48,000+ Records',
      github: 'https://github.com/Satyam-123336/Employee-Salary-Predictor',
      overview: 'An end-to-end demographic compensation classification pipeline developed using Scikit-Learn and trained on over 48,000 real-world employee records.',
      architecture: [
        'Data preprocessing, missing value imputation, and categorical feature encoding across 48,000+ census records.',
        'Model evaluation comparing tree-based boosting ensembles, random forests, and linear classifiers.',
        'Achieved 85.43% test accuracy using optimized ensemble models with tuned hyperparameters.',
        'Interactive Streamlit web application providing single employee manual entry and bulk CSV batch prediction.'
      ],
      stack: ['Python', 'Scikit-Learn', 'Ensemble Learning', 'Streamlit', 'Pandas', 'NumPy']
    },
    chatty: {
      title: 'Chatty Live',
      category: 'Real-Time Web Applications',
      heroStat: 'Sub-50ms Message Latency',
      github: 'https://github.com/Satyam-123336/Chatty',
      overview: 'A lightweight real-time messaging application designed for fast, dependable text communication and clear presence indicators.',
      architecture: [
        'Persistent bidirectional WebSocket channel facilitating sub-50ms message propagation.',
        'Optimistic client updates with automatic rollback upon network interruption.',
        'Client-side local storage caching ensuring fast reload performance and offline message history.',
        'Responsive frontend built with TypeScript, React, and TailwindCSS.'
      ],
      stack: ['TypeScript', 'React', 'WebSockets', 'TailwindCSS', 'Node.js']
    },
    recipefinder: {
      title: 'Recipe Finder App',
      category: 'Frontend & API Integration',
      heroStat: 'Pantry Ingredient Discovery',
      github: 'https://github.com/Satyam-123336/Recipe-Finder-App',
      overview: 'An interactive web application built with JavaScript and React that enables users to find meals using ingredients already in their pantry.',
      architecture: [
        'Ingredient-based search algorithm matching available pantry items against a database of recipes.',
        'Dietary preference and macro-nutrient filters including vegetarian, low-carb, and calorie targets.',
        'Clean, accessible interface with instant client-side filtering and step-by-step cooking directions.'
      ],
      stack: ['JavaScript', 'React', 'REST APIs', 'HTML5', 'CSS3']
    },
    watermonitor: {
      title: 'IoT Water Usage Monitor',
      category: 'Embedded Systems & IoT',
      heroStat: 'Real-Time Flow Telemetry',
      github: 'https://github.com/Satyam-123336/Monitor-Usage-Of-Water-in-Shower---Using-ARDUINO-UNO',
      overview: 'An embedded hardware and software monitoring system combining an Arduino Uno, flow rate sensors, and a JavaScript web dashboard to track water consumption.',
      architecture: [
        'Hall-effect water flow rate sensor interfaced with an Arduino Uno microcontroller.',
        'Embedded C++ firmware calculating instantaneous flow rate (L/min) and cumulative water volume.',
        'Serial-to-web telemetry bridge updating a JavaScript browser dashboard in real time.',
        'Configurable volume threshold alerts designed to reduce domestic shower water waste.'
      ],
      stack: ['Arduino Uno', 'C++', 'Hardware Flow Sensors', 'JavaScript', 'CSS3']
    }
  };

  function initProjectModal() {
    document.querySelectorAll('[data-open-modal]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const projectId = btn.getAttribute('data-open-modal');
        openProjectModal(projectId);
      });
    });

    DOM.modalCloseBtn?.addEventListener('click', closeProjectModal);
    DOM.modalBackdrop?.addEventListener('click', closeProjectModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.projectModal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  function openProjectModal(id) {
    const data = projectDatabase[id];
    if (!data || !DOM.modalContent) return;

    soundEngine.play('click');
    DOM.modalContent.innerHTML = `
      <div style="margin-bottom:24px;">
        <span class="badge-category" style="margin-bottom:12px;display:inline-block;">${data.category}</span>
        <h2 style="font-family:var(--display);font-size:2.4rem;color:var(--text-white);line-height:1.1;">${data.title}</h2>
        <div style="margin-top:8px;font-family:var(--mono);font-size:0.85rem;color:var(--lime);font-weight:700;">
          <i class="fa-solid fa-chart-line"></i> ${data.heroStat}
        </div>
      </div>

      <div style="color:var(--muted);line-height:1.8;margin-bottom:28px;">
        ${data.overview}
      </div>

      <div style="margin-bottom:28px;">
        <h4 style="font-family:var(--mono);font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-white);margin-bottom:14px;">
          <i class="fa-solid fa-layer-group"></i> Architecture Highlights
        </h4>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;padding:0;">
          ${data.architecture.map((item) => `
            <li style="display:flex;gap:12px;align-items:flex-start;color:var(--muted);font-size:0.88rem;line-height:1.6;">
              <i class="fa-solid fa-check" style="color:var(--lime);margin-top:5px;font-size:0.75rem;"></i>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom:34px;">
        <h4 style="font-family:var(--mono);font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-white);margin-bottom:14px;">
          <i class="fa-solid fa-microchip"></i> Technology Stack
        </h4>
        <div class="project-tech-pills" style="padding-top:0;">
          ${data.stack.map((t) => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div style="display:flex;gap:14px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:24px;">
        <a class="button button-primary" href="${data.github}" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i>
          <span>View Source on GitHub</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <button class="button button-glass" id="modal-copy-link-btn" type="button">
          <i class="fa-regular fa-copy"></i>
          <span>Copy GitHub URL</span>
        </button>
      </div>
    `;

    DOM.projectModal.classList.add('open');
    DOM.projectModal.setAttribute('aria-hidden', 'false');
    DOM.body.style.overflow = 'hidden';

    document.getElementById('modal-copy-link-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(data.github).then(() => {
        showToast('Repository URL copied to clipboard!', 'fa-copy');
      });
    });
  }

  function closeProjectModal() {
    DOM.projectModal.classList.remove('open');
    DOM.projectModal.setAttribute('aria-hidden', 'true');
    DOM.body.style.overflow = '';
  }

  // =========================================================================
  // 11. PROJECT CATEGORY FILTERING
  // =========================================================================
  function initProjectFilters() {
    DOM.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        state.activeFilter = filter;

        DOM.filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', String(isActive));
        });

        soundEngine.play('click');

        DOM.projectCards.forEach((card) => {
          const category = card.getAttribute('data-category') || '';
          const match = filter === 'all' || category.includes(filter);

          if (match) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px) scale(0.96)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // =========================================================================
  // 12. ANIMATED NUMBER COUNTERS (`[data-counter]`)
  // =========================================================================
  function initNumberCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, decimals, suffix);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => observer.observe(el));
  }

  function animateCounter(el, target, decimals, suffix) {
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = easedProgress * target;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // =========================================================================
  // 13. FLUID MAGNETIC DUAL-LAYER CURSOR (Desktop Only)
  // =========================================================================
  function initMagneticCursor() {
    if (!state.pointerFine || !DOM.cursorDot || !DOM.cursorAura) return;

    let mouseX = -100, mouseY = -100;
    let auraX = -100, auraY = -100;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      DOM.cursorDot.style.left = `${mouseX}px`;
      DOM.cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      auraX += (mouseX - auraX) * 0.18;
      auraY += (mouseY - auraY) * 0.18;

      DOM.cursorAura.style.left = `${auraX.toFixed(2)}px`;
      DOM.cursorAura.style.top = `${auraY.toFixed(2)}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = 'a, button, .project-card, .skill-pill, .terminal-screen, input, textarea, .palette-item';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        DOM.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        DOM.body.classList.remove('cursor-hover');
      }
    });
  }

  // =========================================================================
  // 14. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function initMobileMenu() {
    function toggleMobileMenu(open) {
      DOM.mobileMenu.classList.toggle('open', open);
      DOM.mobileMenu.setAttribute('aria-hidden', String(!open));
      DOM.navToggle.setAttribute('aria-expanded', String(open));
      DOM.body.style.overflow = open ? 'hidden' : '';
      soundEngine.play('click');
    }

    DOM.navToggle?.addEventListener('click', () => {
      const isOpen = DOM.mobileMenu.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });

    DOM.mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(false));
    DOM.mobileMenuBackdrop?.addEventListener('click', () => toggleMobileMenu(false));

    DOM.mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  // =========================================================================
  // 15. CONTACT FORM & CLIPBOARD ENGINE
  // =========================================================================
  function initContactForm() {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Live character counter
    messageInput?.addEventListener('input', () => {
      const len = messageInput.value.length;
      if (DOM.charCount) {
        DOM.charCount.textContent = `${len} / 1000 characters`;
        DOM.charCount.style.color = len > 950 ? 'var(--danger)' : 'var(--muted-dim)';
      }
    });

    DOM.contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      if (!name) {
        nameError.textContent = 'Please enter your name.';
        valid = false;
      }

      if (!email) {
        emailError.textContent = 'Please enter your email.';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = 'Please provide a valid email address.';
        valid = false;
      }

      if (!message) {
        messageError.textContent = 'Please share a brief message.';
        valid = false;
      }

      if (!valid) {
        soundEngine.play('hover');
        return;
      }

      soundEngine.play('click');
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Satyam,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`);

      DOM.formStatus.textContent = 'Opening Gmail draft...';
      DOM.formStatus.style.color = 'var(--lime)';

      showToast('Opening Gmail composer...', 'fa-envelope-open-text');

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=satyamsamanta10@gmail.com&su=${subject}&body=${body}`;

      setTimeout(() => {
        const opened = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = gmailUrl;
        }
      }, 300);
    });

    function copyEmail() {
      const email = 'satyamsamanta10@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied satyamsamanta10@gmail.com to clipboard!', 'fa-copy');
        soundEngine.play('click');
      }).catch(() => {
        showToast('Email: satyamsamanta10@gmail.com', 'fa-envelope');
      });
    }

    DOM.copyEmailHero?.addEventListener('click', copyEmail);
    DOM.copyEmailCard?.addEventListener('click', copyEmail);
  }

  // =========================================================================
  // 16. LIVE BENGALURU CLOCK & UTILITIES
  // =========================================================================
  function initLiveTime() {
    function updateClock() {
      if (!DOM.localTimeHero) return;
      try {
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat([], options);
        DOM.localTimeHero.textContent = `${formatter.format(new Date())} IST (UTC+5:30)`;
      } catch (e) {
        DOM.localTimeHero.textContent = 'Bengaluru UTC+5:30';
      }
    }
    updateClock();
    setInterval(updateClock, 1000);

    if (DOM.copyrightYear) {
      DOM.copyrightYear.textContent = new Date().getFullYear();
    }
  }

  // =========================================================================
  // 17. SCROLL REVEAL OBSERVER
  // =========================================================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('visible'));
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function debounce(fn, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // =========================================================================
  // 18. BOOTSTRAPPER
  // =========================================================================
  function init() {
    initTheme();
    initAudioToggle();
    initNeuralCanvas();
    initTiltEngine();
    initParallaxAndScroll();
    initTerminal();
    initCommandPalette();
    initProjectModal();
    initProjectFilters();
    initNumberCounters();
    initMagneticCursor();
    initMobileMenu();
    initContactForm();
    initLiveTime();
    initScrollReveal();

    console.log(
      '%c SATYAM SAMANTA %c AI / Full-Stack %c\nPortfolio initialized successfully.',
      'background:#d8f56a;color:#10151d;font-weight:bold;padding:4px 8px;border-radius:3px 0 0 3px;',
      'background:#1c2635;color:#f3f5f8;padding:4px 8px;border-radius:0 3px 3px 0;',
      'color:#8b95a5;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
