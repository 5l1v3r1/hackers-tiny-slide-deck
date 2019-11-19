/** Hacker's Tiny Slide Deck
 *  @author Tuomas Kareinen
 *  @license MIT
 */
;(function(self) {
  const version = "0.0.1-dev"
  const slideClassName = "htsd-slide"
  const slideShownClassName = "htsd-slide--shown"

  const installSlides = () => {
    const headerRegex = /^h(\d)$/i
    const bodyEl = document.querySelector("body")

    const slideEls = []
    let nextSlideContentEls = []

    const mkSlide = () => {
      const slideEl = document.createElement("div")
      slideEl.className = slideClassName
      let lowestHeaderFound = null

      nextSlideContentEls.forEach(e => {
        const headerMatch = headerRegex.exec(e.tagName)
        if (headerMatch && (lowestHeaderFound === null || headerMatch[1] < lowestHeaderFound)) {
          lowestHeaderFound = Number(headerMatch[1])
        }
        bodyEl.removeChild(e)
        slideEl.appendChild(e)
      })

      nextSlideContentEls = []

      if (lowestHeaderFound) {
        slideEl.classList.add(`${slideClassName}--h${lowestHeaderFound}`)
      }

      return slideEl
    }

    let el = bodyEl.firstChild

    while (el != null) {
      const nextEl = el.nextSibling
      if (el.tagName === "HR") {
        bodyEl.removeChild(el)
        if (nextSlideContentEls.length) {
          slideEls.push(mkSlide())
        }
      } else {
        nextSlideContentEls.push(el)
      }
      el = nextEl
    }

    if (nextSlideContentEls.length) {
      slideEls.push(mkSlide())
    }

    slideEls.slice(0, 1).forEach(e => e.classList.add(slideShownClassName))
    slideEls.forEach(e => bodyEl.appendChild(e))
  }

  const installNavigation = () => {
    let currentSlide = 0
    let totalSlides = document.querySelectorAll("body > ." + slideClassName).length

    const hideSlide = n => {
      document.querySelectorAll("body > ." + slideClassName)[n].classList.remove(slideShownClassName)
    }

    const showSlide = n => {
      document.querySelectorAll("body > ." + slideClassName)[n].classList.add(slideShownClassName)
    }

    const showNextSlide = () => {
      if (currentSlide < totalSlides - 1) {
        hideSlide(currentSlide)
        currentSlide += 1
        showSlide(currentSlide)
      }
    }

    const showPreviousSlide = () => {
      if (currentSlide > 0) {
        hideSlide(currentSlide)
        currentSlide -= 1
        showSlide(currentSlide)
      }
    }

    const toggleFullscreen = () => {
      if (document.fullscreenEnabled) {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.querySelector("body").requestFullscreen()
        }
      }
    }

    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault()
          showNextSlide()
          break
        case "ArrowLeft":
          e.preventDefault()
          showPreviousSlide()
          break
        case "F":
          toggleFullscreen()
          break
      }
    })
  }

  const installAll = () => {
    installSlides()
    installNavigation()
  }

  ;(function autoInstall() {
    if (!document.currentScript.hasAttribute("data-manual")) {
      installAll()
    }
  })()

  self.htsd = Object.freeze({
    installAll,
    installNavigation,
    installSlides,
    version
  })
})(window)
