async function init() {
  const [configResponse, textResponse] = await Promise.all([
    fetch('config.json'),
    fetch('texts/surfaces.txt')
  ]);

  let images = await configResponse.json();
  const textContent = await textResponse.text();
  const surface = document.getElementById('surface');

  // Project text fragments (one per line in surfaces.txt)
  const textFragments = textContent.split('\n').filter(line => line.trim());

  // Shuffle order
  images = shuffle(images);

  // Sizes to randomly pick from
  const sizes = ['small', 'medium', 'large'];

  let currentY = 15; // Start position in vh
  let lastZone = 'right'; // Track last horizontal zone to alternate
  let textIndex = 0;

  // Calculate interval to show all text fragments
  const textInterval = Math.max(1, Math.floor(images.length / textFragments.length));

  images.forEach((item, index) => {
    // Insert text fragment evenly distributed
    if (index > 0 && index % textInterval === 0 && textIndex < textFragments.length) {
      const textEl = document.createElement('div');
      textEl.className = 'text-fragment';
      textEl.textContent = textFragments[textIndex];

      // Position text
      const textX = 10 + Math.random() * 50;
      textEl.style.left = `${textX}%`;
      textEl.style.top = `${currentY}vh`;

      surface.appendChild(textEl);

      currentY += 30 + Math.random() * 20;
      textIndex++;
    }

    const el = document.createElement('div');

    // Random size (or use defined)
    const size = item.size || sizes[Math.floor(Math.random() * sizes.length)];
    el.className = `element size-${size}`;

    const img = document.createElement('img');
    const isMobile = window.innerWidth <= 768;
    const photoFolder = isMobile ? 'photos_small' : 'photos';
    img.src = `${photoFolder}/${item.src}`;
    img.alt = '';
    img.loading = 'lazy';
    // Fallback to full size if small version doesn't exist
    if (isMobile) {
      img.onerror = function() {
        this.onerror = null;
        this.src = `photos/${item.src}`;
      };
    }
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

  document.querySelectorAll('.element, .text-fragment').forEach((el) => {
    observer.observe(el);
  });

  // Lightbox for images
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');

  document.querySelectorAll('.element img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Textbox for full text
  const textbox = document.getElementById('textbox');
  const textboxText = document.getElementById('textbox-text');
  const fullText = textFragments.join('\n');

  document.querySelectorAll('.text-fragment').forEach((fragment) => {
    fragment.addEventListener('click', () => {
      textboxText.textContent = fullText;
      textbox.classList.add('active');
    });
  });

  textbox.addEventListener('click', (e) => {
    if (e.target === textbox) {
      textbox.classList.remove('active');
    }
  });

  // Copy to clipboard
  const copyBtn = document.getElementById('textbox-copy');
  copyBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(fullText);
    copyBtn.classList.add('copied');
    setTimeout(() => copyBtn.classList.remove('copied'), 300);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      textbox.classList.remove('active');
    }
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
