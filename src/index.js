import './styles/index.scss'

import Slider from './js/slider.js'

const container = document.querySelector('.carusel-wrapper')
const sliderList = container.querySelector('.main-slider')
const prevButton = document.querySelector('.prev')
const nextButton = document.querySelector('.next')
const markerList = document.querySelector('.slider-indicator__wrapper')
const counter = document.querySelector('.slider-counter')

const carList = document.querySelector('.main-list')
let currentCar = document.querySelector('[data-slider="0"]')

let changeCurrentXCallBack = (slider) => {
  let currentSlide = Math.floor(Math.abs(slider.currentX / slider.step))
  let $newCar = document.querySelector(`[data-slider = "${currentSlide}"]`)
  currentCarUpdater($newCar)
}

const slider = new Slider({
  container,
  sliderList,
  prevButton,
  nextButton,
  markerList,
  counter,
  changeCurrentXCallBack,
})

carList.addEventListener('click', (evt) => {
  evt.preventDefault()

  let btn = evt.target.closest('[data-slider]')
  if (!btn) return

  let sliderNumber = btn.dataset.slider
  if (!sliderNumber) return

  let step = slider.step
  slider.updateCurrentX(-step * +sliderNumber)

  currentCarUpdater(btn)
})

let currentCarUpdater = ($newCar) => {
  currentCar.classList.remove('active')
  currentCar = $newCar
  currentCar.classList.add('active')
}
