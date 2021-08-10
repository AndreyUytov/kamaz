import { animate, back, makeToZero, setupEndValue } from './animate.js'

let makeBackToZero = makeToZero(back)

export default class CustomSlider {
  constructor(config) {
    this.$container = config.container
    this.$sliderList = config.sliderList
    this.$sliderItem = this.$sliderList.firstElementChild
    this.sliderItemsLength = this.$sliderList.children.length
    this.$prevButton = config.prevButton
    this.$nextButton = config.nextButton

    this.changeCurrentXCallBack = config.changeCurrentXCallBack

    this.$markerList = config.markerList
    this.$markerList.innerHTML = this.renderMarkerList()
    this.$counter = config.counter

    this.startX = null
    this._currentX = 0
    this._currentSlide = 0
    this.distance = null

    this.$sliderList.style.touchAction = 'pan-y'

    this.updateCounterSlider()

    this.$sliderList.ondragstart = () => false

    window.addEventListener('resize', () => {
      this.updateCounterSlider()
    })

    this.$nextButton.addEventListener('click', () => {
      let nextSlidePosition = this.currentX - this.step
      this.updateCurrentX(nextSlidePosition)
    })

    this.$prevButton.addEventListener('click', () => {
      let prevSliderPosition = this.currentX + this.step
      this.updateCurrentX(prevSliderPosition)
    })

    this.$sliderList.addEventListener(
      'click',
      (evt) => {
        this.distance = Math.abs(this.startX - evt.clientX)
        if (this.distance > 20) {
          evt.preventDefault()
          evt.stopPropagation()
        }
      },
      true
    )

    this.$sliderList.addEventListener('pointerdown', (evt) => {
      evt.preventDefault()
      this.startX = evt.clientX

      let shiftX = evt.clientX - this.$sliderList.getBoundingClientRect().left

      const moveAt = (evt) => {
        this.currentX =
          evt.clientX - shiftX - this.$container.getBoundingClientRect().left
        this.$sliderList.style.transform = `translateX(${this.currentX}px)`
      }

      const mouseMove = (evt) => {
        moveAt(evt)
      }

      const mouseUp = () => {
        this.updateCurrentX(this.currentX)
        document.removeEventListener('pointermove', mouseMove)
        document.removeEventListener('pointerup', mouseUp)
      }

      document.addEventListener('pointermove', mouseMove)
      document.addEventListener('pointerup', mouseUp)
    })
  }

  renderMarkerList() {
    const arr = new Array(this.sliderItemsLength).fill()

    let indicatorItems = ``

    arr.forEach((el, i) => {
      indicatorItems += `
        <div class="indicator__wrapper">
          <div class="${
            i === 0 ? 'slider-idicator active' : 'slider-idicator'
          }" data-marker-id = "${i}"></div>
        </div>
      `
    })

    return indicatorItems
  }

  get maxX() {
    let widthContainer = this.$container.getBoundingClientRect().width
    let sliderListWidth = this.$sliderList.scrollWidth
    return widthContainer - sliderListWidth
  }

  get step() {
    let widthItem = this.$sliderItem.offsetWidth
    return widthItem
  }

  get currentX() {
    return this._currentX
  }

  set currentX(value) {
    this._currentX = value
  }

  get currentSlide() {
    return this._currentSlide
  }

  useCallBack() {
    if (this.changeCurrentXCallBack) {
      this.changeCurrentXCallBack(this)
    }
  }

  updateCurrentSlide() {
    this._currentSlide = Math.floor(Math.abs(this.currentX / this.step))
  }

  isRightEdge(value) {
    return value <= this.maxX ? true : false
  }

  isLeftEdge(value) {
    return value >= 0 ? true : false
  }

  updateMarkerList() {
    if (this.$markerList) {
      this.$markerList.children[
        this.currentSlide
      ].firstElementChild.classList.remove('active')
      this.updateCurrentSlide()
      this.$markerList.children[
        this.currentSlide
      ].firstElementChild.classList.add('active')
    }
  }

  updateCounterSlider() {
    if (this.$counter) {
      let currentNumber = Math.floor(Math.abs(this.currentX / this.step)) + 1
      this.$counter.firstElementChild.textContent = currentNumber
      this.$counter.lastElementChild.textContent = this.sliderItemsLength

      let fonSizeCurrentCount = parseInt(
        getComputedStyle(this.$counter.firstElementChild).fontSize
      )
      animate({
        duration: 600,
        timing: makeBackToZero,
        draw: (progress) => {
          this.$counter.firstElementChild.style.fontSize = `${setupEndValue(
            30,
            fonSizeCurrentCount,
            progress
          )}px`
        },
      }).then(() => {
        this.$counter.firstElementChild.style.fontSize = ''
      })
    }
  }

  updateButtonsDisabled() {
    if (this.isLeftEdge(this.currentX)) {
      this.$prevButton.disabled = true
      this.$nextButton.disabled = false
    } else if (this.isRightEdge(this.currentX)) {
      this.$nextButton.disabled = true
      this.$prevButton.disabled = false
    } else {
      this.$nextButton.disabled = false
      this.$prevButton.disabled = false
    }
  }

  animationSlider(initValue, endValue) {
    return animate({
      duration: 500,
      draw: (progress) => {
        this.$sliderList.style.transform = `translateX(${setupEndValue(
          initValue,
          endValue,
          progress
        )}px)`
      },
      timing: makeBackToZero,
    })
  }

  updateCurrentX(newX) {
    const prevCurrentX = this.currentX

    if (this.isLeftEdge(newX)) {
      this.currentX = 0
    } else if (this.isRightEdge(newX)) {
      this.currentX = this.maxX
    } else {
      let step = this.step
      this.currentX = Math.round(newX / step) * step
    }

    this.animationSlider(prevCurrentX, this.currentX).then(() => {
      this.updateButtonsDisabled()
      this.updateCounterSlider()
      this.updateMarkerList()
      this.useCallBack()
    })
  }
}
