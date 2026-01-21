document.addEventListener('DOMContentLoaded', () => {
  const lightbox = setupLightbox();
  const gallerySelectors = [
    '.OYun-card img',
    '.oyun-box img',
    '.oyun-kart img',
    '.game-box img',
    '.hediye img',
    '.Oyun-list img',
    '.onecikan-games img',
    '#orta-alt img',
    '.orta-alt img',
    '.sepet-item img',
    'table img'
  ];

  const interactiveImages = Array.from(
    new Set(
      gallerySelectors
        .map((selector) => Array.from(document.querySelectorAll(selector)))
        .flat()
    )
  ).filter((img) => shouldEnhance(img));

  interactiveImages.forEach((img) => {
    img.classList.add('interactive-image');
    img.setAttribute('tabindex', '0');

    const open = () => openLightbox(img, lightbox);

    img.addEventListener('click', open);
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
});

function shouldEnhance(img) {
  if (!img) {
    return false;
  }
  if (img.closest('#logo')) {
    return false;
  }
  const src = (img.getAttribute('src') || '').toLowerCase();
  if (src.includes('logo') || src.includes('icon')) {
    return false;
  }
  if (img.dataset.noLightbox === 'true' || img.classList.contains('no-lightbox')) {
    return false;
  }
  return true;
}

function setupLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = [
    '<div class="image-lightbox__content" role="dialog" aria-modal="true">',
    '  <button class="image-lightbox__close" aria-label="Görseli kapat">&times;</button>',
    '  <img class="image-lightbox__img" src="" alt="">',
    '  <p class="image-lightbox__caption"></p>',
    '</div>'
  ].join('');

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.image-lightbox__close');
  closeBtn.addEventListener('click', () => closeLightbox(overlay));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeLightbox(overlay);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox(overlay);
    }
  });

  return {
    overlay,
    image: overlay.querySelector('.image-lightbox__img'),
    caption: overlay.querySelector('.image-lightbox__caption')
  };
}

function openLightbox(sourceImage, lightbox) {
  if (!lightbox || !sourceImage) {
    return;
  }

  lightbox.image.src = sourceImage.src;
  lightbox.image.alt = sourceImage.alt || '';
  lightbox.caption.textContent = sourceImage.dataset.caption || sourceImage.alt || 'Görsel önizleme';

  requestAnimationFrame(() => {
    lightbox.overlay.classList.add('is-visible');
    lightbox.overlay.setAttribute('aria-hidden', 'false');
  });
}

function closeLightbox(overlay) {
  if (!overlay) {
    return;
  }

  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
}
