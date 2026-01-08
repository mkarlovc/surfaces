async function init() {
  const response = await fetch('config.json');
  let images = await response.json();
  const surface = document.getElementById('surface');

  // Shuffle order
  images = shuffle(images);

  // Sizes to randomly pick from
  const sizes = ['small', 'medium', 'large'];

  let currentY = 15; // Start position in vh
  let lastZone = 'right'; // Track last horizontal zone to alternate

  images.forEach((item, index) => {
    const el = document.createElement('div');

    // Random size (or use defined)
    const size = item.size || sizes[Math.floor(Math.random() * sizes.length)];
    el.className = `element size-${size}`;

    const img = document.createElement('img');
    img.src = `images/${item.src}`;
    img.alt = '';
    img.loading = 'lazy';
    el.appendChild(img);

    // Alternate zones with less overlap
    let x;
    if (lastZone === 'right') {
      x = 3 + Math.random() * 30; // Left zone: 3-33%
      lastZone = 'left';
    } else {
      x = 40 + Math.random() * 25; // Right zone: 40-65%
      lastZone = 'right';
    }
    el.style.left = `${x}%`;

    // Vertical spacing - a bit more room
    const spacing = 55 + Math.random() * 50; // 55-105vh between images
    el.style.top = `${currentY}vh`;
    currentY += spacing;

    surface.appendChild(el);
  });

  // Set surface height with extra padding before footer
  surface.style.height = `${currentY + 80}vh`;

  // Intersection Observer for reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  document.querySelectorAll('.element').forEach((el) => {
    observer.observe(el);
  });
}

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

init();
