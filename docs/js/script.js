const breedingNew = document.getElementById('breedingNew')
const revealNow = document.getElementById('revealNow')
const cryogenicEl = document.querySelector('.cryogenic')
let creoCamera = document.getElementById('creoCamera')
let potionsSlider = document.getElementById('potionsSlider')

const breedingState = {
    status: false,
    step: 'start'
}

//Wallet
const walletBlock = document.getElementById('WalletBlock')

walletBlock.addEventListener('click', function(e){
    const target = e.target

    if ( target.closest('#WalletDropdownBtn') ) {

        walletBlock.classList.add('open')
        setTimeout(function(){
            walletBlock.classList.add('on')
        }, 100)

    } else if ( target.closest('#WalletDropdownCloseBtn') ) {

        walletBlock.classList.remove('on')
        setTimeout(function(){
            walletBlock.classList.remove('open')
        }, 100)
    }

})

//Timers
function Timer (el, timeStart, timeNow) {
    this.el = el
    this.timeStart = timeStart
    this.timeNow = timeNow
    this.interval = null
}
Timer.prototype.start = function (stopFunc) {
    const total = 0.25
    const timeFinished = this.timeStart.getTime() + total*60*1000

    this.stopFunc = stopFunc

    this.interval = setInterval(function(){
        const timeLeft = timeFinished - new Date().getTime()

        if ( timeLeft > 0 ) {
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor(timeLeft / 1000);
            this.el.innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        } else {
            this.el.innerHTML = '00:00'
            this.stop(this.stopFunc)
        }

    }.bind(this), 1000)
}
Timer.prototype.stop = function(stopfunc) {
    clearInterval(this.interval)
    stopfunc()
}
Timer.prototype.clear = function() {
    clearInterval(this.interval)
    this.el.innerHTML = '00:00'
}

//CreoCamera

function Breeding() {
    this.cryogenicEl = cryogenicEl
    this.timeouts = []
    this.timer = null
    this.sounds = {}
    this.sounds.water = new Audio('audio/01_sound_water.mp3')
    this.sounds.splash = new Audio('audio/02_sound_splash.mp3')
    this.sounds.robot = new Audio('audio/05_sound_robot.mp3')
    this.sounds.robot.loop = true
    this.sounds.mutant1 = new Audio('audio/03_sound_mutant.mp3')
    this.sounds.mutant2 = new Audio('audio/04_sound_mutant.mp3')
    this.sounds.complete = new Audio('audio/06_breeding_complete.mp3?v01')
    this.sounds.reveal = new Audio('audio/07_breeding_reveal.mp3?v01')

    this.timeoutFunc = function(func, time) {
        this.timeouts.push(
            setTimeout(func.bind(this), time)
        )
    }

}

Breeding.prototype.start = function() {

    if ( !this.checkReady() ) return false

    breedingState.step = 'in-progress'

    this.cryogenicEl.className = 'cryogenic started step_1'
    this.sounds.water.play()

    sliders.cryo.disable()
    sliders.cryo.lockSlide()

    const timerEl = creoCamera.querySelector('.breeding-timer')

    this.timer = new Timer(timerEl, new Date(), new Date())
    this.timer.start(this.finish.bind(this))

    this.timeoutFunc(function() {
        this.cryogenicEl.classList.add('embrion-start')
        this.cryogenicEl.classList.add('splash_1_start')

        this.timeoutFunc(function() {
            this.cryogenicEl.classList.add('on')
        }, 50)

        this.timeoutFunc(function() {
            this.sounds.splash.play()
        }, 400)

        this.timeoutFunc(function() {
            this.sounds.robot.play()
        }, 600)

    }, 3500)

    this.timeoutFunc(function() {
        this.cryogenicEl.classList.remove('splash_1_start')
        this.cryogenicEl.classList.add('splash_2_start')

        this.timeoutFunc(function() {
            this.sounds.mutant1.play()
        }, 400)

    }, 4500)

    this.timeoutFunc(function() {
        this.cryogenicEl.classList.remove('splash_2_start')
        this.cryogenicEl.classList.add('splash_3_start')

        this.timeoutFunc(function() {
            this.sounds.mutant2.play()
        }, 400)
    }, 5500)

    this.timeoutFunc(function() {
        this.cryogenicEl.classList.remove('step_1')
        this.cryogenicEl.classList.add('step_2')
    }, 6000)

    this.timeoutFunc(function() {
        this.cryogenicEl.className = 'cryogenic in-progress'
    }, 6300)
}
Breeding.prototype.reload = function() {
    this.cryogenicEl.className = 'cryogenic'

    sliders.cryo.enable()

    for ( let timeout of this.timeouts ) {
        clearTimeout(timeout)
    }
    for ( let sound in this.sounds ) {
        this.sounds[sound].pause()
        this.sounds[sound].currentTime = 0
    }

    this.timer.clear()

    const creoCameraWrapper = this.cryogenicEl.querySelector('.creo-camera-wrapper')
    const content = creoCameraWrapper.cloneNode(true)
          creoCameraWrapper.remove()
          this.cryogenicEl.prepend(content)

    creoCamera = document.getElementById('creoCamera')
    breedingState.step = 'start'
    breeding.checkReady()
}
Breeding.prototype.finish = function() {

    this.cryogenicEl.className = 'cryogenic in-progress completed'
    this.sounds.complete.play()
    this.sounds.robot.pause()

    setTimeout(function(){
        this.cryogenicEl.classList.add('on')
    }.bind(this), 100)

    setTimeout(function(){
        this.cryogenicEl.className = 'cryogenic completed on'
    }.bind(this), 1100)

    breedingState.step = 'completed'
}
Breeding.prototype.checkReady = function() {

    const plateNotReady = this.cryogenicEl.querySelector('.plate.not-ready-for-breeding')
    const plateNotReadyParent = this.cryogenicEl.querySelector('.plate.not-ready-parent')
    const plateReady = this.cryogenicEl.querySelector('.plate.ready-for-breeding')

    breedingState.status = false

    if ( breedingState.step === 'start' ) {
        plateNotReady.classList.add('show')
        plateReady.classList.remove('show')
        plateNotReadyParent.classList.remove('show')
    }

    if ( breedingState.step === 'potion-checked' ) {

        plateNotReady.classList.remove('show')

        if ( !sliders.cryo.lockCheck() ) {
            plateReady.classList.add('show')
            plateNotReadyParent.classList.remove('show')
            breedingState.status = true
        } else {
            plateReady.classList.remove('show')
            plateNotReadyParent.classList.add('show')
            breedingState.status = false
        }
    }

    return breedingState.status
}
const breeding = new Breeding()

//Swipers
const sliders = {
    scroll: {
        init: function() {
            new Swiper('.swiper-scroll', {
                direction: "vertical",
                slidesPerView: "auto",
                freeMode: true,
                scrollbar: {
                    el: ".swiper-scrollbar",
                    draggable: true
                },
                mousewheel: true,
            })
        }
    },
    nft: {
        array: [],
        init: function(el) {
            el.forEach(e => {
                this.array.push(
                    new Swiper(e, {
                        slidesPerView: "auto",
                        freeMode: true,
                        navigation: {
                            prevEl: e.querySelector('.swiper-button-prev'),
                            nextEl: e.querySelector('.swiper-button-next'),
                        },
                        scrollbar: {
                            el: e.querySelector('.swiper-scrollbar'),
                            draggable: true,
                        },
                        mousewheel: {
                            forceToAxis: true
                        },
                        on: {
                            init: function(swiper) {
                                const swiperOverflow = swiper.$el.closest('.swiper-overflow')[0]
                                if ( swiperOverflow ) {
                                    if ( !swiper.slides.length ) {
                                        swiperOverflow.classList.add('empty')
                                    } else {
                                        swiperOverflow.classList.remove('empty')
                                    }
                                }
                            }
                        }
                    })
                )
            })
        }
    },
    cryo: {
        array: [],
        init: function(el) {
            el.forEach(e => {
                this.array.push(
                    new Swiper(e, {
                        effect: 'coverflow',
                        centeredSlides: true,
                        slidesPerView: 1,
                        initialSlide: 1,
                        navigation: {
                            prevEl: e.querySelector('.swiper-button-prev'),
                            nextEl: e.querySelector('.swiper-button-next'),
                        },
                        scrollbar: {
                            el: e.querySelector('.swiper-scrollbar'),
                            draggable: true,
                        },
                        mousewheel: {
                            forceToAxis: true
                        },
                        coverflowEffect: {
                            rotate: 0,
                            scale: 0.65,
                            stretch: 192
                        },
                        on: {
                            slideChange: function() {
                                breeding.checkReady()
                            }
                        }
                    })
                )
            })
        },
        disable: function() {
            this.array.forEach(function(e) {
                e.$el[0].classList.add('disabled')
                e.disable()
            })
        },
        enable: function() {
            this.array.forEach(function(e) {
                e.$el[0].classList.remove('disabled')
                e.enable()
            })
        },
        lockSlide: function() {
            this.array.forEach(function(e) {
                const activeSlide = e.slides[e.activeIndex]
                activeSlide.classList.add('locked-slide')
            })
        },
        unlockSlide: function() {
            this.array.forEach(function(e) {
                const activeSlide = e.slides[e.activeIndex]
                activeSlide.classList.remove('locked-slide')
            })
        },
        lockCheck: function() {
            let status = false
            for ( let slider of this.array ) {
                const activeSlide = slider.slides[slider.activeIndex]
                if ( activeSlide.classList.contains('locked-slide') ) {
                    status = true
                    break
                }
            }
            return status
        }
    }
}
sliders.scroll.init()
sliders.nft.init(document.querySelectorAll('.swiper'))
sliders.cryo.init(document.querySelectorAll('.cryo-swiper'))


//EventListeners
cryogenicEl.addEventListener('click', function(e) {
    if ( !breedingState.status ) return false
    if ( e.target.closest('#creoCamera') ) breeding.start()
})

potionsSlider.addEventListener('click', function(e) {
    const potion = e.target.closest('.swiper-slide')

    if ( potion && !potion.classList.contains('locked') && breedingState.step !== 'potion-checked') {
        potion.classList.add('locked')
        breedingState.step = 'potion-checked'

        breeding.checkReady()
    }

})
breedingNew.addEventListener('click', function(e){
    e.preventDefault()
    breeding.reload()
})
