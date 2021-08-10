import './styles/index.scss'

import Slider from './js/slider.js'

const container = document.querySelector('.carusel-wrapper')
const sliderList = container.querySelector('.main-slider')
const prevButton = document.querySelector('.prev')
const nextButton = document.querySelector('.next')
const markerList = document.querySelector('.slider-indicator__wrapper')
const counter = document.querySelector('.slider-counter')

new Slider({
  container,
  sliderList,
  prevButton,
  nextButton,
  markerList,
  counter,
})
