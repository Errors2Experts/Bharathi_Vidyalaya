/* ==========================================================================
   Bharathi Vidyalaya — Gallery Page JS
   Photo Lightbox + Video Carousel (smooth slide)
============================================================================= */

document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- 1. PHOTO LIGHTBOX ---------- */
  const lightbox      = document.getElementById('lightbox')
  const lightboxImg   = document.getElementById('lightboxImg')
  const lightboxClose = document.getElementById('lightboxClose')
  const galleryItems  = document.querySelectorAll('.gallery-item')

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img')
      if (!img) return

      lightboxImg.src = img.src
      lightboxImg.alt = img.alt || 'Gallery photo'
      lightbox.classList.add('open')
      document.body.style.overflow = 'hidden'
    })
  })

  function closeLightbox() {
    lightbox.classList.remove('open')
    document.body.style.overflow = ''
  }

  lightboxClose?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox()
    }
  })

  /* ============================= 2. VIDEO CAROUSEL ============================== */
  const track = document.getElementById('videoTrack')
  const slides = track? Array.from(track.children) : []
  const prevBtn = document.getElementById('videoPrev')
  const nextBtn = document.getElementById('videoNext')
  const dotsBox = document.getElementById('videoDots')

  if (!track || slides.length === 0) return;

  let current = 0
  const total = slides.length

  // ======================  Create DOts ===========================
  slides.forEach((_,i)=>{
    const dot = document.createElement('button');
    dot.className = 'video-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to video ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  })

  const dots = Array.from(dotsBox.children);

  function goTo(index) {
    // Pause the currently playing video
    const currentVideo = slides[current]?.querySelector('video')
    if (currentVideo) {
      currentVideo.pause()
    }

    current = (index + total) % total

    // Smooth slide
    track.style.transform = `translateX(-${current * 100}%)`

    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current)
    })
  }
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('open')) return; // ignore when lightbox is open
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
})