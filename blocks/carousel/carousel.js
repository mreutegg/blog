import {
  createTag,
  createSVG,
} from '../block-helpers.js';

/**
 * The carousel's navigation
 * @param {element} $block The container of the carousel
 */
function carouselAndLightbox($block) {
  const $wrapper = $block.querySelector('.carousel-wrapper');
  const $lightbox = $block.querySelector('.carousel-lightbox');
  const $expandButtons = $wrapper.querySelectorAll('.carousel-expand');
  const $carouselSlides = $wrapper.querySelectorAll('.carousel-slide');
  const $lightboxSlides = $lightbox.querySelectorAll('.carousel-slide');
  const $dots = $wrapper.querySelectorAll('.carousel-dot');
  const $carouselPrevious = $wrapper.querySelector('.carousel-previous');
  const $carouselNext = $wrapper.querySelector('.carousel-next');
  const $lightboxPrevious = $lightbox.querySelector('.carousel-previous');
  const $lightboxNext = $lightbox.querySelector('.carousel-next');
  const $lightboxThumbnails = $lightbox.querySelectorAll('.carousel-dot');
  const $closeLightbox = $lightbox.querySelector('.carousel-close-lightbox');
  const updateCarousel = ($slides, $navDots, index) => {
    const current = $slides[index];
    const prev = $slides[index - 1] ?? $slides[[...$slides].length - 1];
    const next = $slides[index + 1] ?? $slides[0];
    $slides.forEach((slide) => {
      slide.classList.remove('slide-active');
      slide.classList.remove('slide-prev');
      slide.classList.remove('slide-next');
    });
    current.classList.add('slide-active');
    prev.classList.add('slide-prev');
    next.classList.add('slide-next');
    $navDots.forEach((otherDot) => {
      otherDot.classList.remove('dot-active');
    });
    $navDots[index].classList.add('dot-active');
  };
  let carouselIndex = 0;
  updateCarousel($carouselSlides, $dots, carouselIndex);
  const incrementCurrentCarousel = (next = true) => {
    let $slides = $carouselSlides;
    let $navDots = $dots;
    if ($wrapper.closest('.block.carousel').classList.contains('lightbox')) {
      $slides = $lightboxSlides;
      $navDots = $lightboxThumbnails;
    }
    if (next) {
      carouselIndex += 1;
      if (carouselIndex > [...$slides].length - 1) carouselIndex = 0;
    } else {
      carouselIndex -= 1;
      if (carouselIndex < 0) carouselIndex = [...$slides].length - 1;
    }
    $navDots[carouselIndex].focus({ preventScroll: true });
    updateCarousel($slides, $navDots, carouselIndex);
  };
  $carouselNext.addEventListener('click', () => { incrementCurrentCarousel(true); });
  $carouselPrevious.addEventListener('click', () => { incrementCurrentCarousel(false); });
  $lightboxNext.addEventListener('click', () => { incrementCurrentCarousel(true); });
  $lightboxPrevious.addEventListener('click', () => { incrementCurrentCarousel(false); });
  [...$dots].forEach(($dot, index) => {
    $dot.addEventListener('click', () => {
      if (index !== carouselIndex) {
        carouselIndex = index;
        updateCarousel($carouselSlides, $dots, carouselIndex);
      }
    });
  });
  [...$lightboxThumbnails].forEach(($thumbnail, index) => {
    $thumbnail.addEventListener('click', () => {
      if (index !== carouselIndex) {
        carouselIndex = index;
        updateCarousel($lightboxSlides, $lightboxThumbnails, carouselIndex);
      }
    });
  });
  [...$expandButtons].forEach(($btn) => {
    $btn.addEventListener('click', () => {
      updateCarousel($lightboxSlides, $lightboxThumbnails, carouselIndex);
      $wrapper.closest('.block.carousel').classList.add('lightbox');
    });
  });
  const closeLightbox = () => {
    $wrapper.classList.add('no-animation');
    updateCarousel($carouselSlides, $dots, carouselIndex);
    $wrapper.closest('.block.carousel').classList.remove('lightbox');
    setTimeout(() => { $wrapper.classList.remove('no-animation'); }, 300);
  };
  $closeLightbox.addEventListener('click', closeLightbox);
  $lightbox.addEventListener('click', (e) => {
    // Close lightbox when click on background=
    if ((e.target.tagName.toLowerCase() !== 'img'
    && e.target.tagName.toLowerCase() !== 'button'
    && e.target.tagName.toLowerCase() !== 'svg'
    && e.target.tagName.toLowerCase() !== 'use'
    && e.target.tagName.toLowerCase() !== 'path'
    && !e.target.classList.contains('carousel-controls'))) {
      closeLightbox();
    }
  });
  $block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      incrementCurrentCarousel(false);
    } else if (e.key === 'ArrowRight') {
      incrementCurrentCarousel(true);
    } else if (e.key === 'Escape' && $wrapper.closest('.block.carousel').classList.contains('lightbox')) {
      closeLightbox();
    }
  });
}

/**
 * Builds the carousel html
 * @param {NodeList} $imgs The images to fill the carousel
 * @param {element} $block The container of the carousel
 * @param {string} aspectRatio height ÷ width percentage of the carousel, ex: 50%;
 */
function buildCarousel($imgs, $block, aspectRatio) {
  $block.innerHTML = '';
  const $wrapper = createTag('div', { class: 'carousel-wrapper' });
  const $controls = createTag('div', { class: 'carousel-controls' });
  const $slides = createTag('div', { class: 'carousel-slides' });
  const $dots = createTag('div', { class: 'carousel-dots' });
  const $slideswrapper = createTag('div', { tabIndex: '0' });
  $wrapper.appendChild($controls);
  $wrapper.appendChild($slides);
  $wrapper.appendChild($dots);
  $slides.appendChild($slideswrapper);
  $block.appendChild($wrapper);
  const $prev = createTag('button', { class: 'carousel-arrow carousel-previous', 'aria-label': 'Previous slide' });
  const $next = createTag('button', { class: 'carousel-arrow carousel-next', 'aria-label': 'Next slide' });
  $prev.appendChild(createSVG('chevron'));
  $next.appendChild(createSVG('chevron'));
  $controls.appendChild($prev);
  $controls.appendChild($next);
  [...$imgs].forEach(($img, index) => {
    const $slide = createTag('div', { class: 'carousel-slide' });
    $slide.appendChild($img);
    const $expandButton = createTag('button', { class: 'carousel-expand', 'aria-label': 'Open in full screen' });
    $expandButton.appendChild(createSVG('expand'));
    $slide.appendChild($expandButton);
    $slideswrapper.appendChild($slide);
    const $dot = createTag('button', { class: 'carousel-dot', 'aria-label': `Slide ${index + 1}` });
    $dots.appendChild($dot);
  });
  const $lightbox = $wrapper.cloneNode(true);
  $lightbox.classList.add('carousel-lightbox');
  const $closeButton = createTag('button', { class: 'carousel-close-lightbox', 'aria-label': 'Close full screen' });
  $closeButton.appendChild(createSVG('close'));
  $lightbox.appendChild($closeButton);
  $block.appendChild($lightbox);
  const $lightboxThumbnails = $lightbox.querySelectorAll('.carousel-dot');
  [...$lightboxThumbnails].forEach(($thumbnail, index) => {
    $thumbnail.appendChild($imgs[index].cloneNode(true));
  });
  if (aspectRatio) $slideswrapper.style.paddingBottom = aspectRatio;
  carouselAndLightbox($block);
}

export default function decorate($block) {
  const $imgs = $block.querySelectorAll('picture');
  // Find the aspect ratio of the shortest image:
  let aspectRatio;
  [...$imgs].forEach(($picture) => {
    const $img = $picture.querySelector('img');
    const ratio = $img.offsetHeight / $img.offsetWidth;
    if (aspectRatio === undefined || ratio < aspectRatio) aspectRatio = ratio;
  });
  // Build the carousel:
  $block.innerHTML = '';
  buildCarousel($imgs, $block, `${(aspectRatio * 100)}%`);
}
