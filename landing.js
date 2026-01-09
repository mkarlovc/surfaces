async function init() {
  const response = await fetch('config.json');
  const images = await response.json();

  // Pick random image for landing
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.getElementById('landing-image').src = `images/${randomImage.src}`;
}

init();
