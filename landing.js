async function init() {
  const response = await fetch('config.json');
  const images = await response.json();

  // Pick random image for landing
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const img = document.getElementById('landing-image');
  const isMobile = window.innerWidth <= 768;
  const photoFolder = isMobile ? 'photos_small' : 'photos';

  img.src = `${photoFolder}/${randomImage.src}`;

  // Fallback to full size if small version doesn't exist
  if (isMobile) {
    img.onerror = function() {
      this.onerror = null;
      this.src = `photos/${randomImage.src}`;
    };
  }
}

init();
