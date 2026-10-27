/**
 * BIRTHDAY CELEBRATION SCRIPT
 * Dedicated to: Võ Nguyễn Minh Anh - 26/10
 */

// --- Audio removed per user request (completely silent) ---
const audioPlayer = {
  playPopSound: () => {},
  playChimeFanfare: () => {},
  startMelody: () => {},
  stopMelody: () => {},
  toggle: () => {}
};

// --- 1. Site Entry Password Gate (Mật khẩu: 010723) ---
const SITE_PASSWORD = '010723';

function setupSiteLock() {
  const lockOverlay = document.getElementById('site-lock-overlay');
  const lockCard = document.getElementById('site-lock-card');
  const lockForm = document.getElementById('site-lock-form');
  const lockInput = document.getElementById('site-lock-input');
  const lockToggle = document.getElementById('lock-toggle-pwd');
  const lockError = document.getElementById('lock-error-msg');
  const lockSubmitBtn = document.getElementById('site-lock-submit-btn');
  const lockIcon = document.getElementById('lock-symbol-icon');
  const lockIconBadge = document.getElementById('lock-icon-badge');
  const relockBtn = document.getElementById('site-relock-btn');

  if (!lockOverlay) return;

  // Check session storage
  if (sessionStorage.getItem('hpbd_site_unlocked') === 'true') {
    lockOverlay.classList.add('unlocked');
    lockOverlay.style.display = 'none';
  } else {
    lockOverlay.style.display = 'flex';
    lockOverlay.classList.remove('unlocked');
    setTimeout(() => {
      if (lockInput) lockInput.focus();
    }, 300);
  }

  // Toggle password visibility
  if (lockToggle && lockInput) {
    lockToggle.addEventListener('click', () => {
      const isPwd = lockInput.type === 'password';
      lockInput.type = isPwd ? 'text' : 'password';
      lockToggle.textContent = isPwd ? '🙈' : '👁️';
    });
  }

  // Handle unlock attempt
  function attemptUnlock() {
    if (!lockInput) return;
    const entered = (lockInput.value || '').trim();

    if (entered === SITE_PASSWORD) {
      if (lockError) lockError.textContent = '';
      lockInput.classList.remove('error');

      if (lockIcon) lockIcon.textContent = '🔓';
      if (lockIconBadge) lockIconBadge.classList.add('success');
      if (lockSubmitBtn) {
        lockSubmitBtn.classList.add('success');
        lockSubmitBtn.innerHTML = '<span>✨</span> Mở Khóa Thành Công!';
      }

      sessionStorage.setItem('hpbd_site_unlocked', 'true');
      
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      setTimeout(() => {
        lockOverlay.classList.add('unlocked');
        setTimeout(() => {
          lockOverlay.style.display = 'none';
        }, 600);
      }, 500);

    } else {
      if (lockCard) {
        lockCard.classList.remove('shake');
        void lockCard.offsetWidth; // re-flow
        lockCard.classList.add('shake');
      }
      lockInput.classList.add('error');
      if (lockError) {
        lockError.textContent = '❌ Mật khẩu chưa chính xác! Hãy thử lại nhé 💔';
      }
      setTimeout(() => {
        lockInput.value = '';
        lockInput.focus();
      }, 500);
    }
  }

  if (lockForm) {
    lockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      attemptUnlock();
    });
  }

  // Allow re-locking from the top bar
  if (relockBtn) {
    relockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('hpbd_site_unlocked');
      if (lockIcon) lockIcon.textContent = '🔒';
      if (lockIconBadge) lockIconBadge.classList.remove('success');
      if (lockSubmitBtn) {
        lockSubmitBtn.classList.remove('success');
        lockSubmitBtn.innerHTML = '<span>🗝️</span> Mở Khóa Trang Web';
      }
      if (lockInput) {
        lockInput.value = '';
        lockInput.classList.remove('error');
      }
      if (lockError) lockError.textContent = '';
      lockOverlay.style.display = 'flex';
      void lockOverlay.offsetWidth;
      lockOverlay.classList.remove('unlocked');
      setTimeout(() => {
        if (lockInput) lockInput.focus();
      }, 200);
      if (typeof showToast === 'function') {
        showToast('🔒 Đã khóa lại trang web!');
      }
    });
  }
}

// --- 2. Canvas Starfield Background ---
function initStarfield() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Create stars
  const starCount = Math.floor((width * height) / 8000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      color: ['#fff', '#fbcfe8', '#ffd166', '#c084fc'][Math.floor(Math.random() * 4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.abs(Math.sin(Date.now() * 0.001 * star.speed * 20 + star.x)) * 0.7 + 0.3;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// --- 3. Fireworks & Confetti Launcher ---
function launchConfetti(originX = 0.5, originY = 0.6) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#ff6584', '#ffd166', '#c084fc', '#38bdf8', '#ff758c', '#ffffff']
    });
  }
}

function launchMassiveFireworks() {
  if (typeof confetti !== 'function') return;

  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1200 };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 } }));
  }, 250);
}

// --- 4. Unbox Gift Modal ---
function setupGiftModal() {
  const overlay = document.getElementById('gift-modal-overlay');
  const openBtn = document.getElementById('open-gift-btn');
  const giftBox = document.getElementById('gift-box-container');

  function openGift() {
    // Lift lid
    const lid = document.querySelector('.gift-lid');
    if (lid) {
      lid.style.transform = 'translateY(-60px) rotate(-15deg)';
    }

    launchMassiveFireworks();
    audioPlayer.startMelody();

    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 600);
  }

  if (openBtn) openBtn.addEventListener('click', openGift);
  if (giftBox) giftBox.addEventListener('click', openGift);
}

// --- 5. Blow Birthday Candles ---
let candlesBlown = false;

function blowCandles() {
  if (candlesBlown) {
    // Relight if already blown
    relightCandles();
    return;
  }
  candlesBlown = true;

  const flames = document.querySelectorAll('.flame');
  flames.forEach(flame => flame.classList.add('extinguished'));

  audioPlayer.playChimeFanfare();
  launchMassiveFireworks();

  const msg = document.getElementById('wish-unlocked-message');
  if (msg) {
    msg.classList.add('visible');
  }

  const blowBtn = document.getElementById('blow-candle-btn');
  if (blowBtn) {
    blowBtn.innerHTML = '✨ Thắp lại nến';
  }
}

function relightCandles() {
  candlesBlown = false;
  const flames = document.querySelectorAll('.flame');
  flames.forEach(flame => flame.classList.remove('extinguished'));

  const msg = document.getElementById('wish-unlocked-message');
  if (msg) {
    msg.classList.remove('visible');
  }

  const blowBtn = document.getElementById('blow-candle-btn');
  if (blowBtn) {
    blowBtn.innerHTML = '🎂 Nhấn để thổi nến & ước một điều!';
  }
  launchConfetti(0.5, 0.5);
}

// --- 6. Floating Balloons Generator ---
function createFloatingBalloons() {
  const colors = [
    'linear-gradient(135deg, #ff758c, #ff4d6d)',
    'linear-gradient(135deg, #ffd166, #ffb703)',
    'linear-gradient(135deg, #c084fc, #9333ea)',
    'linear-gradient(135deg, #38bdf8, #0284c7)',
    'linear-gradient(135deg, #4ade80, #16a34a)'
  ];

  const blessings = ['Xinh Đẹp ✨', 'Vui Vẻ 🌸', 'Hạnh Phúc ❤️', 'Thành Công 🌟', 'Bình An 🕊️', '+100 May Mắn 🍀'];

  function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 85 + 5 + 'vw';
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDuration = (Math.random() * 5 + 9) + 's';

    balloon.addEventListener('click', (e) => {
      audioPlayer.playPopSound();
      launchConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight);

      // Show floating text
      const popText = document.createElement('div');
      popText.innerText = blessings[Math.floor(Math.random() * blessings.length)];
      popText.style.position = 'fixed';
      popText.style.left = `${e.clientX}px`;
      popText.style.top = `${e.clientY}px`;
      popText.style.transform = 'translate(-50%, -50%)';
      popText.style.color = '#fff';
      popText.style.fontWeight = 'bold';
      popText.style.fontSize = '1.2rem';
      popText.style.textShadow = '0 0 10px rgba(255, 101, 132, 0.8)';
      popText.style.zIndex = '9999';
      popText.style.pointerEvents = 'none';
      popText.style.animation = 'floatTag 1.2s ease-out forwards';
      document.body.appendChild(popText);

      setTimeout(() => popText.remove(), 1200);
      balloon.remove();
    });

    document.body.appendChild(balloon);

    setTimeout(() => {
      if (balloon.parentElement) balloon.remove();
    }, 15000);
  }

  // Initial balloons
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnBalloon, i * 1500);
  }
  // Recurring
  setInterval(spawnBalloon, 4000);
}

// --- 7. Wax Seal Letter ---
function toggleLetter() {
  const letter = document.getElementById('letter-content');
  const seal = document.getElementById('wax-seal-btn');
  if (!letter) return;

  const isOpen = letter.classList.contains('open');
  if (!isOpen) {
    letter.classList.add('open');
    if (seal) seal.style.display = 'none';
    audioPlayer.playPopSound();
    launchConfetti(0.5, 0.7);
  }
}

// --- 8. Wishes Guestbook / Lantern Release ---
const INITIAL_WISHES = [
  { name: 'Anh Yêu ❤️', text: 'Chúc em yêu sinh nhật 26/10 siêu rực rỡ, ngày càng xinh đẹp và mãi hạnh phúc bên anh nhé!' },
  { name: 'Gia Đình ❤️', text: 'Chúc em tuổi mới luôn bình an, vui vẻ và là niềm tự hào của cả nhà!' },
  { name: 'Hội Bạn Thân 👭', text: 'Chúc em sinh nhật 26/10 ngập tràn niềm vui, tiếng cười và may mắn!' }
];


function loadWishes() {
  const container = document.getElementById('wishes-board');
  if (!container) return;

  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem('minh_anh_wishes') || '[]');
  } catch (e) {
    stored = [];
  }

  const allWishes = [...INITIAL_WISHES, ...stored];
  container.innerHTML = '';
  allWishes.forEach(w => {
    const badge = document.createElement('div');
    badge.className = 'user-wish-badge';
    badge.innerHTML = `<strong>${escapeHtml(w.name)}:</strong> "${escapeHtml(w.text)}"`;
    container.appendChild(badge);
  });
}

function sendWish(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wish-sender-name');
  const textInput = document.getElementById('wish-sender-text');

  const name = nameInput.value.trim() || 'Người gửi ẩn danh';
  const text = textInput.value.trim();

  if (!text) {
    showToast('Vui lòng nhập lời chúc của bạn nhé!');
    return;
  }

  const newWish = { name, text };
  try {
    let stored = JSON.parse(localStorage.getItem('minh_anh_wishes') || '[]');
    stored.unshift(newWish);
    localStorage.setItem('minh_anh_wishes', JSON.stringify(stored));
  } catch (err) {}

  loadWishes();
  nameInput.value = '';
  textInput.value = '';

  audioPlayer.playChimeFanfare();
  launchConfetti(0.5, 0.8);
  showToast('✨ Lời chúc đã được gửi lên bầu trời ước nguyện!');
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

// --- 9. Toast Notification ---
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.innerHTML = `<span>✨</span> ${message}`;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// --- 10. Share Modal & URL Dynamic Names ---
function setupShareModal() {
  const shareBtn = document.getElementById('share-btn');
  const modal = document.getElementById('share-modal');
  const closeBtn = document.getElementById('close-share-modal');
  const copyBtn = document.getElementById('copy-share-btn');
  const linkInput = document.getElementById('share-link-input');
  const qrImg = document.getElementById('share-qr-img');

  const currentUrl = window.location.href;
  if (linkInput) linkInput.value = currentUrl;

  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }

  if (copyBtn && linkInput) {
    copyBtn.addEventListener('click', () => {
      linkInput.select();
      navigator.clipboard.writeText(linkInput.value).then(() => {
        showToast('Đã sao chép link chia sẻ thành công! 💖');
      }).catch(() => {
        document.execCommand('copy');
        showToast('Đã sao chép link chia sẻ thành công! 💖');
      });
    });
  }
}

// Custom name from query params (e.g. ?name=Võ Nguyễn Minh Anh&date=26/10)
function handleQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const date = params.get('date');

  if (name) {
    const nameEls = document.querySelectorAll('.dynamic-name');
    nameEls.forEach(el => el.textContent = name);
    document.title = `Chúc Mừng Sinh Nhật ${name} | ${date || '26/10'} ✨`;
  }
  if (date) {
    const dateEls = document.querySelectorAll('.dynamic-date');
    dateEls.forEach(el => el.textContent = date);
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupSiteLock();
  initStarfield();
  setupGiftModal();
  createFloatingBalloons();
  setupShareModal();
  handleQueryParams();
  loadWishes();


  // Fireworks top button
  const fireworkBtn = document.getElementById('firework-btn');
  if (fireworkBtn) {
    fireworkBtn.addEventListener('click', () => {
      launchMassiveFireworks();
      audioPlayer.playChimeFanfare();
    });
  }

  // Candle button and candle flames
  const blowBtn = document.getElementById('blow-candle-btn');
  if (blowBtn) {
    blowBtn.addEventListener('click', blowCandles);
  }
  const flames = document.querySelectorAll('.flame');
  flames.forEach(flame => flame.addEventListener('click', blowCandles));

  // Wax seal
  const waxSeal = document.getElementById('wax-seal-btn');
  if (waxSeal) {
    waxSeal.addEventListener('click', toggleLetter);
  }

  // Wish form
  const wishForm = document.getElementById('wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', sendWish);
  }

  // Memory Timeline & Vault & Lightbox initialization
  renderMemories();
  setupTimelineTabs();
  setupPrivateVault();

  // Lightbox event bindings
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });
});

// --- 11. MEMORY TIMELINE & GALLERY DATA ---
const MEMORIES = [
  // Mùa xuân 2025
  {
    id: 'm1',
    category: 'spring2025',
    title: 'Những Ngày Đầu Tiên',
    date: '02 Tháng 02, 2025',
    desc: 'Bức ảnh lưu giữ những khoảnh khắc đầu tiên ngọt ngào, nụ cười rạng rỡ của em yêu.',
    type: 'image',
    src: 'gallery/15A46FCD-EFBA-4280-A125-1E76AA981D00.jpg',
    tag: 'Khởi đầu'
  },
  {
    id: 'm2',
    category: 'spring2025',
    title: 'Dịu Dàng Nắng Xuân',
    date: '02 Tháng 02, 2025',
    desc: 'Khoảnh khắc tự nhiên, xinh đẹp và trong trẻo nhất của em.',
    type: 'image',
    src: 'gallery/IMG_1625.jpg',
    tag: 'Nụ cười'
  },
  {
    id: 'm3',
    category: 'spring2025',
    title: 'Bình Yên Bên Em',
    date: '02 Tháng 02, 2025',
    desc: 'Chỉ cần ở bên em yêu là mọi âu lo đều tan biến.',
    type: 'image',
    src: 'gallery/IMG_1648.jpg',
    tag: 'Bình yên'
  },
  // Mùa hè 2026
  {
    id: 'm4',
    category: 'summer2026',
    title: 'Bình Minh Mùa Hè Rực Rỡ',
    date: '08 Tháng 07, 2026',
    desc: 'Bắt đầu hành trình mùa hè đầy ắp tiếng cười và những trải nghiệm mới cùng em.',
    type: 'video',
    src: 'gallery/IMG_6467.MOV',
    poster: 'gallery/IMG_6467_poster.jpg',
    tag: 'Thước phim'
  },
  {
    id: 'm5',
    category: 'summer2026',
    title: 'Ánh Chiều Tà Lãng Mạn',
    date: '08 Tháng 07, 2026',
    desc: 'Khoảnh khắc hoàng hôn buông xuống làm bừng sáng góc ảnh thân thương.',
    type: 'image',
    src: 'gallery/IMG_6513.jpg',
    tag: 'Hoàng hôn'
  },
  {
    id: 'm6',
    category: 'summer2026',
    title: 'Chuyến Đi Của Thanh Xuân',
    date: '08 Tháng 07, 2026',
    desc: 'Những thước phim chuyển động ghi dấu bước chân kỷ niệm của hai đứa mình.',
    type: 'video',
    src: 'gallery/IMG_6527.MOV',
    poster: 'gallery/IMG_6527_poster.jpg',
    tag: 'Thước phim'
  },
  {
    id: 'm7',
    category: 'summer2026',
    title: 'Nắng Sớm Tinh Khôi',
    date: '09 Tháng 07, 2026',
    desc: 'Mỗi sớm mai thức dậy đều là một ngày tuyệt vời có em yêu bên cạnh.',
    type: 'image',
    src: 'gallery/IMG_6543.jpg',
    tag: 'Rạng rỡ'
  },
  {
    id: 'm8',
    category: 'summer2026',
    title: 'Nụ Cười Tỏa Nắng',
    date: '10 Tháng 07, 2026',
    desc: 'Nụ cười làm tan chảy mọi trái tim, luôn rực rỡ và tràn đầy sức sống.',
    type: 'image',
    src: 'gallery/IMG_6569.jpg',
    tag: 'Hạnh phúc'
  },
  {
    id: 'm9',
    category: 'summer2026',
    title: 'Khoảnh Khắc Đáng Yêu',
    date: '10 Tháng 07, 2026',
    desc: 'Thước phim ngập tràn sự hồn nhiên và niềm vui trong từng giây phút.',
    type: 'video',
    src: 'gallery/IMG_6576.MOV',
    poster: 'gallery/IMG_6576_poster.jpg',
    tag: 'Thước phim'
  },
  {
    id: 'm10',
    category: 'summer2026',
    title: 'Chiều Êm Đềm Tháng 7',
    date: '10 Tháng 07, 2026',
    desc: 'Khoảng lặng êm đềm giữa những ngày hè nhộn nhịp.',
    type: 'image',
    src: 'gallery/IMG_6863.jpg',
    tag: 'Bình yên'
  },
  {
    id: 'm11',
    category: 'summer2026',
    title: 'Góc Nhỏ Kỷ Niệm',
    date: '10 Tháng 07, 2026',
    desc: 'Mỗi nơi chúng ta đi qua đều trở thành những kỷ niệm vô giá.',
    type: 'image',
    src: 'gallery/IMG_6927.jpg',
    tag: 'Kỷ niệm'
  },
  {
    id: 'm12',
    category: 'summer2026',
    title: 'Đêm Lấp Lánh Ánh Đèn',
    date: '10 Tháng 07, 2026',
    desc: 'Khung cảnh lung linh khép lại những ngày hè tuyệt đẹp.',
    type: 'image',
    src: 'gallery/IMG_6931.jpg',
    tag: 'Đêm sao'
  },
  // Sinh nhật 2025 & Mùa đông
  {
    id: 'm13',
    category: 'bday2025',
    title: 'Trưa Sinh Nhật 2025 Rực Rỡ',
    date: '26 Tháng 10, 2025',
    desc: 'Bắt đầu ngày sinh nhật năm trước với niềm vui bất ngờ và nụ cười rạng ngời.',
    type: 'image',
    src: 'gallery/IMG_20251026_130806.jpg',
    tag: 'Sinh nhật 2025'
  },
  {
    id: 'm14',
    category: 'bday2025',
    title: 'Bữa Tiệc Sinh Nhật Ấm Cúng',
    date: '26 Tháng 10, 2025',
    desc: 'Không gian ấm áp quây quần chúc mừng tuổi mới của em yêu.',
    type: 'image',
    src: 'gallery/IMG_20251026_203127.jpg',
    tag: 'Tiệc tối'
  },
  {
    id: 'm15',
    category: 'bday2025',
    title: 'Ánh Nến Lung Linh Ước Nguyện',
    date: '26 Tháng 10, 2025',
    desc: 'Ánh nến phản chiếu những ước mơ đẹp đẽ sắp thành hiện thực.',
    type: 'image',
    src: 'gallery/IMG_20251026_205139.jpg',
    tag: 'Ngọn nến'
  },
  {
    id: 'm16',
    category: 'bday2025',
    title: 'Gửi Điều Ước Tới Các Vì Sao',
    date: '26 Tháng 10, 2025',
    desc: 'Khoảnh khắc thiêng liêng khi em yêu nhắm mắt ước điều ước tuổi mới.',
    type: 'image',
    src: 'gallery/IMG_20251026_205208.jpg',
    tag: 'Ước nguyện'
  },
  {
    id: 'm17',
    category: 'bday2025',
    title: 'Girl Phố Phong Cách',
    date: '12 Tháng 12, 2025',
    desc: 'Phong cách cá tính, siêu ngầu và cuốn hút của em yêu.',
    type: 'image',
    src: 'gallery/IMG_20251212_204836.jpg',
    tag: 'Girl Phố'
  },
  // Mùa thu 2026 gần đây
  {
    id: 'm18',
    category: 'autumn2026',
    title: 'Đón Chờ Sinh Nhật 2026',
    date: '25 Tháng 10, 2026',
    desc: 'Những bước chuẩn bị chu đáo để đón chào ngày 26/10 thật trọn vẹn.',
    type: 'image',
    src: 'gallery/IMG_3960.jpg',
    tag: 'Sinh nhật 2026'
  },
  {
    id: 'm19',
    category: 'autumn2026',
    title: 'Xinh Đẹp & Trưởng Thành',
    date: '25 Tháng 10, 2026',
    desc: 'Em yêu ở tuổi mới ngày càng cuốn hút, rạng ngời và tự tin.',
    type: 'image',
    src: 'gallery/IMG_3961.jpg',
    tag: 'Rực rỡ'
  },
  {
    id: 'm20',
    category: 'autumn2026',
    title: 'Món Quà Dành Cho Em',
    date: '25 Tháng 10, 2026',
    desc: 'Tất cả tình cảm và sự chân thành anh gửi trọn vào trang web sinh nhật này.',
    type: 'image',
    src: 'gallery/IMG_3969.jpg',
    tag: 'Yêu thương'
  }
];


let currentFilter = 'all';
let currentActiveList = [...MEMORIES];
let currentLightboxIndex = 0;

function renderMemories() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  if (currentFilter === 'all') {
    currentActiveList = [...MEMORIES];
  } else {
    currentActiveList = MEMORIES.filter(m => m.category === currentFilter);
  }

  grid.innerHTML = '';
  currentActiveList.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;

    let mediaHtml = '';
    if (item.type === 'video') {
      mediaHtml = `
        <div class="memory-media-container">
          <img src="${item.poster}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="media-badge-video">▶ Video</div>
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="memory-media-container">
          <img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy">
        </div>
      `;
    }

    card.innerHTML = `
      ${mediaHtml}
      <div class="memory-info">
        <div class="memory-date-tag">📅 ${escapeHtml(item.date)}</div>
        <h4 class="memory-title">${escapeHtml(item.title)}</h4>
        <p class="memory-desc">${escapeHtml(item.desc)}</p>
        <div class="memory-footer">
          <span class="memory-tag-badge">#${escapeHtml(item.tag)}</span>
          <button class="like-heart-btn" onclick="event.stopPropagation(); toggleHeart(this)">
            ♥ <span class="like-count">1</span>
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(index));
    grid.appendChild(card);
  });
}

function toggleHeart(btn) {
  const countEl = btn.querySelector('.like-count');
  let current = parseInt(countEl.textContent, 10) || 1;
  if (btn.classList.contains('liked')) {
    btn.classList.remove('liked');
    btn.style.color = '#ff6584';
    countEl.textContent = current - 1;
  } else {
    btn.classList.add('liked');
    btn.style.color = '#f43f5e';
    countEl.textContent = current + 1;
    audioPlayer.playPopSound();
  }
}

// Filter tabs
function setupTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      if (cat === 'vault') {
        const vaultSec = document.getElementById('private-vault-section');
        if (vaultSec) {
          vaultSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        currentFilter = cat;
        renderMemories();
      }
    });
  });
}

// Lightbox
function openLightbox(index) {
  const modal = document.getElementById('lightbox-modal');
  const mediaWrap = document.getElementById('lightbox-media-wrapper');
  const dateEl = document.getElementById('lightbox-date');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  if (!modal || !currentActiveList[index]) return;

  currentLightboxIndex = index;
  const item = currentActiveList[index];

  dateEl.textContent = item.date;
  titleEl.textContent = item.title;
  descEl.textContent = item.desc;

  mediaWrap.innerHTML = '';
  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.src;
    video.poster = item.poster || '';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    mediaWrap.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    mediaWrap.appendChild(img);
  }

  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const mediaWrap = document.getElementById('lightbox-media-wrapper');
  if (modal) {
    modal.classList.remove('active');
    if (mediaWrap) mediaWrap.innerHTML = '';
  }
}

function nextLightbox() {
  if (currentActiveList.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentActiveList.length;
  openLightbox(currentLightboxIndex);
}

function prevLightbox() {
  if (currentActiveList.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentActiveList.length) % currentActiveList.length;
  openLightbox(currentLightboxIndex);
}

// --- 12. SENSITIVE PRIVATE VAULT (MẬT KHẨU: 010723 / 261017) ---
const VAULT_PASSWORDS = ['010723', '261017'];

function setupPrivateVault() {
  const form = document.getElementById('vault-form');
  const passInput = document.getElementById('vault-passcode-input');
  const content = document.getElementById('vault-unlocked-content');
  const lockIcon = document.getElementById('vault-lock-icon');
  const unlockBtn = document.getElementById('unlock-vault-btn');

  // Check if previously unlocked in this session
  if (sessionStorage.getItem('vault_unlocked') === 'true') {
    unlockVaultUI();
  }

  function unlockVaultUI() {
    if (content) content.classList.add('show');
    if (lockIcon) {
      lockIcon.innerHTML = '🔓';
      lockIcon.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      lockIcon.style.animation = 'none';
    }
    if (unlockBtn) {
      unlockBtn.innerHTML = '✨ Đã Mở Khóa Thành Công!';
      unlockBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      unlockBtn.disabled = true;
    }
    if (passInput) {
      passInput.value = '••••••';
      passInput.disabled = true;
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = (passInput.value || '').trim();

      if (VAULT_PASSWORDS.includes(entered)) {
        sessionStorage.setItem('vault_unlocked', 'true');
        audioPlayer.playChimeFanfare();
        launchMassiveFireworks();
        unlockVaultUI();
        showToast('🔓 Mở khóa thành công kỷ niệm bí mật của chúng mình! ❤️');

        setTimeout(() => {
          content.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else {
        passInput.classList.add('error');
        showToast('❌ Mật khẩu chưa chính xác! Hãy thử lại nhé.');
        audioPlayer.playPopSound();
        setTimeout(() => {
          passInput.classList.remove('error');
          passInput.value = '';
          passInput.focus();
        }, 600);
      }
    });
  }

  // Allow clicking the unlocked photo to open in lightbox
  const sensitivePhoto = document.getElementById('vault-sensitive-photo');
  if (sensitivePhoto) {
    sensitivePhoto.addEventListener('click', () => {
      openLightboxCustom({
        title: 'Khoảnh Khắc Riêng Tư Của Chúng Mình ❤️',
        date: '02 Tháng 02, 2025',
        desc: 'Khoảnh khắc quý giá chỉ dành riêng cho hai ta.',
        src: 'gallery/sensitive/IMG_1553.jpg',
        type: 'image'
      });
    });
  }
}

function openLightboxCustom(item) {
  const modal = document.getElementById('lightbox-modal');
  const mediaWrap = document.getElementById('lightbox-media-wrapper');
  const dateEl = document.getElementById('lightbox-date');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  if (!modal) return;

  dateEl.textContent = item.date;
  titleEl.textContent = item.title;
  descEl.textContent = item.desc;
  mediaWrap.innerHTML = `<img src="${item.src}" alt="${item.title}" style="max-height: 80vh;">`;
  modal.classList.add('active');
}

