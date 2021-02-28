import './styles/index.scss'

function swipe (el, settings) {
  settings = {...settings, minDist: 60, maxDist: 120, maxTime:700, minTime: 50}

  let dir, swipeType, dist, startX = 0, distX = 0, startY = 0, distY = 0, startTime = 0

  function checkStart (e) {
    console.log('from start');
    el.setPointerCapture(e.pointerId)
    dir = 'none'
    dist = 0
    startX = e.pageX
    startY = e.pageY
    startTime = new Date().getTime()

    el.addEventListener('pointermove', checkMove)
  }

  function checkMove(e) {
    console.log('from move');
    distX = e.pageX - startX
    distY = e.pageY - startY

    if(Math.abs(distX) > Math.abs(distY)) {
      dir = (distX < 0) ? 'left' : 'right'
    } else dir = (distY < 0) ? 'up' : 'down'
  }

  function checkEnd(e) {
    console.log('from end');
     let endTime = new Date().getTime()
     let time = endTime - startTime
     if(time >= settings.minTime && time <= settings.maxTime) {
       if(Math.abs(distX) >= settings.minDist && Math.abs(distY) <= settings.maxDist) {
        swipeType = dir
       } else if (Math.abs(distY) >= settings.minDist && Math.abs(distX) <= settings.maxDist) {
         swipeType = dir
       }
     }
     dist = (dir === 'left' || dir === 'right') ? Math.abs(distX) : Math.abs(distY)

     if (swipeType !== 'none' && dist >= settings.minDist) {
       let swipeEvent = new CustomEvent('swipe', {
         bubbles: true,
         cancelable: true,
         detail: {
           full: e,
           dir: swipeType,
           dist: dist,
           time: time
         }
       })
       el.dispatchEvent(swipeEvent)
     }
     el.removeEventListener('pointermove', checkMove)
  }
  el.addEventListener('pointerdown', checkStart)
  el.addEventListener('pointerup', checkEnd)
}

const caruselWrapper = document.querySelector('.carusel-wrapper')
const slider = caruselWrapper.querySelector('.main-slider')
const controlls = document.querySelector('.main-slider__controlls')

const sliderIndicators = document.querySelectorAll('.slider-idicator')
const indicators = Array.from(sliderIndicators)

const counter = document.querySelector('.slider-counter__item--active')

const imgs = caruselWrapper.querySelectorAll('img')
console.log(imgs);
imgs.forEach(el => el.ondragstart = () => false)

swipe(caruselWrapper)
caruselWrapper.addEventListener('swipe', (e) => {
  console.log(e.detail);
  let swipeDir = e.detail.dir
  if (swipeDir === 'right' || swipeDir === 'left') {
    console.log(swipeDir);
    controlls.dispatchEvent(new Event('click'))
  }
})

let currentPosition = 0

controlls.addEventListener('click', (evt) => {
  let step = caruselWrapper.getBoundingClientRect().width
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
})



