// script.js - ĐÃ THÊM ACTIVE NAV KHI SCROLL
const CONFIG = { theme: "green", video: { blur: 1, brightness: 1 }, sound: { autoPlay: true, volume: 0.5 } };

document.body.setAttribute('data-theme', CONFIG.theme);
document.getElementById('bg-video').style.filter = `blur(${CONFIG.video.blur}px) brightness(${CONFIG.video.brightness})`;

// Particles
particlesJS("particles-js", {
  particles: { number: { value: 80 }, color: { value: "#00ff99" }, shape: { type: "circle" }, opacity: { value: 0.3 }, size: { value: 3 }, line_linked: { enable: true, color: "#00ff99", opacity: 0.1 }, move: { speed: 1 } },
  interactivity: { events: { onhover: { enable: true, mode: "repulse" } } }
});

// Nav scroll
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// === ACTIVE NAV KHI SCROLL ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Anti-Inspect
const antiInspect = document.getElementById('antiInspect');
let devtoolsOpen = false;
const threshold = 160;
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 's')) {
    e.preventDefault(); showAntiInspect();
  }
});
['contextmenu', 'selectstart', 'dragstart'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));
setInterval(() => {
  if ((window.outerHeight - window.innerHeight > threshold) || (window.outerWidth - window.innerWidth > threshold)) {
    if (!devtoolsOpen) { devtoolsOpen = true; showAntiInspect(); }
  } else devtoolsOpen = false;
}, 500);
function showAntiInspect() {
  antiInspect.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { document.body.innerHTML = ''; document.head.innerHTML = ''; }, 3000);
}

// Modal
const modal = document.getElementById('projectModal');
document.querySelector('.close').onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.style.display = 'none'; });

// Load Projects
fetch('projects.json')
  .then(r => { if (!r.ok) throw new Error('Không tìm thấy projects.json'); return r.json(); })
  .then(projects => {
    const container = document.getElementById('projectContainer');
    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<p style="color: var(--accent); text-align: center;">Chưa có dự án nào.</p>';
      return;
    }
    projects.forEach(p => {
      const img = new Image();
      const path = `assets/img/${p.image}`;
      img.onload = () => createCard(p, path, container, true);
      img.onerror = () => createCard(p, '', container, false);
      img.src = path;
    });
  })
  .catch(err => {
    document.getElementById('projectContainer').innerHTML = `<p style="color: var(--accent); text-align: center;">Lỗi: ${err.message}</p>`;
  });

function createCard(p, path, container, hasImg) {
  const card = document.createElement('div');
  card.className = 'project-card animate-on-scroll';
  card.innerHTML = `
    <div class="project-img"><img src="${path}" alt="${p.title}" ${hasImg ? '' : 'style="display:none"'}>
      ${!hasImg ? '<div style="height:500px;background:#333;color:#aaa;display:flex;align-items:center;justify-content:center;">[Ảnh lỗi]</div>' : ''}
    </div>
    <div class="project-info"><h3>${p.title}</h3><div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>
  `;
  card.onclick = () => showProjectModal(p, path);
  container.appendChild(card);
  observer.observe(card);
}

function showProjectModal(p, imgPath) {
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  const media = document.getElementById('modalMedia');
  if (p.videoLink && p.videoLink.includes('embed')) {
    media.innerHTML = `<iframe src="${p.videoLink}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (imgPath) {
    media.innerHTML = `<img src="${imgPath}" alt="${p.title}">`;
  } else {
    media.innerHTML = `<div style="height:300px;background:#333;display:flex;align-items:center;justify-content:center;color:#aaa;font-style:italic;">Không có media</div>`;
  }
  const links = document.getElementById('modalLinks');
  links.innerHTML = p.links?.length ? p.links.map(l => `<a href="${l.url}" class="modal-link" target="_blank" ${l.url ? '' : 'disabled'}">${l.label}</a>`).join('') : '<p style="color: var(--gray); font-style: italic;">Chưa có link</p>';
  document.getElementById('modalTech').innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
  modal.style.display = 'flex';
}

// Sound
const audio = document.getElementById('bgm');
const toggle = document.getElementById('soundToggle');
let isPlaying = false;
audio.volume = CONFIG.sound.volume;
const playMusic = () => audio.play().then(() => { isPlaying = true; toggle.innerHTML = '<i class="fas fa-volume-up"></i>'; }).catch(() => {});
if (CONFIG.sound.autoPlay) {
  const unlock = () => { if (!isPlaying) playMusic(); document.body.removeEventListener('click', unlock); document.body.removeEventListener('touchstart', unlock); };
  document.body.addEventListener('click', unlock);
  document.body.addEventListener('touchstart', unlock);
}
toggle.addEventListener('click', () => {
  if (isPlaying) { audio.pause(); toggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; }
  else playMusic();
  isPlaying = !isPlaying;
});

// EmailJS
emailjs.init("ze_nGnqXTNdn3uf4u");
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = "Đang gửi...";
  emailjs.send('service_kqth8v8', 'template_r8x7qxl', {
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    message: document.getElementById('message').value
  }).then(() => {
    status.innerHTML = "Gửi thành công! Mình sẽ trả lời sớm. <i class='fas fa-check-circle'></i>";
    this.reset();
  }, () => {
    status.innerHTML = "Lỗi, thử lại sau nhé! <i class='fas fa-exclamation-triangle'></i>";
  });
});

// Typing Effect
document.addEventListener("DOMContentLoaded", () => {
  const typing = document.querySelector(".typing");
  if (!typing) return;
  const roles = ["Developer", "Molder", "GUI Designer", "Scripter", "Module Creator", "Modeler", "Coder", "UI/UX Engineer", "Content Creator", "Game Developer", "Web Designer", "Roblox Developer", "Manager Of MC Servers", "Electronic Engineer"];
  let roleIndex = 0, charIndex = 0, isDeleting = false, isPaused = false;
  const typingSpeed = 20, deletingSpeed = 10, pauseAfterType = 1500, pauseAfterDelete = 300;
  function typeWriter() {
    if (isPaused) return requestAnimationFrame(typeWriter);
    const prefix = "I am ", current = roles[roleIndex], full = prefix + current;
    if (!isDeleting && charIndex <= full.length) {
      typing.textContent = full.substring(0, charIndex++); setTimeout(() => requestAnimationFrame(typeWriter), typingSpeed);
    } else if (!isDeleting && charIndex > full.length) {
      isPaused = true; setTimeout(() => { isPaused = false; isDeleting = true; requestAnimationFrame(typeWriter); }, pauseAfterType);
    } else if (isDeleting && charIndex > 0) {
      typing.textContent = full.substring(0, charIndex--); setTimeout(() => requestAnimationFrame(typeWriter), deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; isPaused = true;
      setTimeout(() => { isPaused = false; requestAnimationFrame(typeWriter); }, pauseAfterDelete);
    }
  }
  setTimeout(() => requestAnimationFrame(typeWriter), 800);
});