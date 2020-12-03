import './styles/index.scss'

const caruselWrapper = document.querySelector('.carusel-wrapper')
const slider = caruselWrapper.querySelector('.main-slider')
const controlls = document.querySelector('.main-slider__controlls')

const sliderIndicators = document.querySelectorAll('.slider-idicator')
const indicators = Array.from(sliderIndicators)

const counter = document.querySelector('.slider-counter__item--active')

let currentPosition = 0

controlls.addEventListener('click', (evt) => {
  let step = caruselWrapper.getBoundingClientRect().width
  if (
    evt.target.closest('.main-slider__snap') ||
    evt.target.closest('.indicator__wrapper')
  ) {
    if (currentPosition === 0) {
      slider.style.marginLeft = -step + 'px'
      indicators.forEach((elem) => {
        elem.classList.toggle('slider-idicator--active')
      })
      counter.textContent = 2
      currentPosition = -step
    } else {
      slider.style.marginLeft = ''
      indicators.forEach((elem) => {
        elem.classList.toggle('slider-idicator--active')
      })
      counter.textContent = 1
      currentPosition = 0
    }
  }
})
