import './styles/index.scss'

const caruselWrapper = document.querySelector('.carusel-wrapper')
const slider = caruselWrapper.querySelector('.main-slider')

const sliderIndicators = document.querySelectorAll('.slider-idicator')

const snaps = document.querySelectorAll('.main-slider__snap')

let step = caruselWrapper.offsetWidth

console.log(step)
