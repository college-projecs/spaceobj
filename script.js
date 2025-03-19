const container = document.querySelector('.slider-container')
const track = document.querySelector('.slider-track')
const slides = document.querySelectorAll('.slide')
const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const dots = document.querySelectorAll('.dot')

let slideWidth = 1200
let slideMargin = 10
let totalSlideWidth = slideWidth + slideMargin * 2
let currentIndex = 0
const totalSlides = slides.length

function getContainerWidth() {
  return container.offsetWidth
}

function updateSlider() {
  const containerWidth = getContainerWidth()
  const centerOfSlide = currentIndex * totalSlideWidth + slideWidth / 2 + slideMargin
  let offset = centerOfSlide - containerWidth / 2
  const totalTrackWidth = totalSlides * totalSlideWidth
  if (offset < 0) offset = 0
  const maxOffset = totalTrackWidth - containerWidth
  if (maxOffset > 0 && offset > maxOffset) offset = maxOffset
  track.style.transform = `translateX(-${offset}px)`
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex)
  })
}

function goToSlide(index) {
  if (index < 0) index = totalSlides - 1
  if (index >= totalSlides) index = 0
  currentIndex = index
  updateSlider()
}

prevBtn.addEventListener('click', () => {
  goToSlide(currentIndex - 1)
})

nextBtn.addEventListener('click', () => {
  goToSlide(currentIndex + 1)
})

dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    goToSlide(idx)
  })
})

window.addEventListener('resize', updateSlider)
updateSlider()