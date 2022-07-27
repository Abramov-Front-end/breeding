const breedingNew = document.getElementById('breedingNew')
const revealNow = document.getElementById('revealNow')
const cryogenicEl = document.querySelector('.cryogenic')
let creoCamera = document.getElementById('creoCamera')
let potionsSlider = document.getElementById('potionsSlider')
let myBreedingSlider = document.getElementById('myBreedingSlider')

let breedingState = {
    status: false,
    step: 'start',
    potion: null,
    lockedPotions: [],
    parents: [],
    babyid: null,
    datestart: null
}
const babiesOptions = {

}
//Wallet
const walletBlock = document.getElementById('WalletBlock')

function Wallet(btnOpen, btnClose) {

}
Wallet.prototype.open = function(){
    walletBlock.classList.add('open')
    sliders.scroll.slider.update(true)
    sliders.scroll.slider.scrollbar.updateSize()
    setTimeout(function(){
        walletBlock.classList.add('on')
    }, 100)
}
Wallet.prototype.close = function(){
    walletBlock.classList.remove('on')
    setTimeout(function(){
        walletBlock.classList.remove('open')
    }, 100)
}
const wallet = new Wallet()
document.addEventListener('click', function(e){
    const target = e.target

    if ( target.closest('#WalletDropdownBtn') ) {

        if ( target.closest('.open') ) {
            wallet.close()
        } else {
            wallet.open()
        }

    } else if ( target.closest('#WalletDropdownCloseBtn') ) {
        wallet.close()
    } else if ( target.closest('.btn__chosen') ) {
        wallet.open()
    }
})

//Timers
function Timer (el, timeStart) {
    this.el = el
    this.timeStart = timeStart ? new Date(+timeStart) : new Date()

    this.interval = null
}
Timer.prototype.start = function (stopFunc) {

    const total = 0.25
    const timeFinished = this.timeStart.getTime() + total*60*1000

    this.stopFunc = stopFunc

    this.interval = setInterval(function(){
        const dateNow = new Date().getTime()
        const timeLeft = timeFinished - dateNow

        if ( timeLeft > 0 ) {
            let s = Math.floor(timeLeft / 1000);
            let m = Math.floor(s / 60);

            s %= 60;
            m %= 60;

            s = (s < 10) ? "0" + s : s;
            m = (m < 10) ? "0" + m : m;

            this.el.innerHTML = m + ':' + s;

            if(this.el.closest('.nft-item')) {
                let progress = (timeFinished - this.timeStart.getTime() - timeLeft) / (timeFinished - this.timeStart.getTime()) * 100
                this.el.closest('.nft-item').querySelector('.nft-item__progress-bar__handler').style.width = Math.floor(progress) + '%'
            }
        } else {
            this.el.innerHTML = ':'
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
    this.sounds.glass = new Audio('audio/08_glass_broke.mp3')
    this.sounds.reveal = new Audio('audio/07_breeding_reveal.mp3?v01')

    this.timeoutFunc = function(func, time) {
        this.timeouts.push(
            setTimeout(func.bind(this), time)
        )
    }
}

Breeding.prototype.start = function() {

    if ( !this.checkReady() ) return false

    const potionTitle = this.cryogenicEl.querySelector('.potion .potion__title b')
    potionTitle.innerHTML = '#' + breedingState.potion

    const editGenesBTN = this.cryogenicEl.querySelector('.btn_type_genes')
    editGenesBTN.classList.remove('show')

    const babyid = Math.floor(+breedingState.parents[0]+breedingState.parents[0] + Math.floor(Math.random()*1000))

    breedingState.step = 'in-progress'
    breedingState.lockedPotions.push(breedingState.potion)
    breedingState.datestart = new Date().getTime()
    breedingState.babyid = babyid

    sliders.nft.appendSlide(babyid)

    for(let key in this.sounds) {
        const sound = this.sounds[key]
        sound.play()
        sound.pause()
    }

    this.cryogenicEl.className = 'cryogenic started step_1'
    this.sounds.water.play()

    sliders.cryo.disable()
    sliders.cryo.lockSlide()

    const timerEl = creoCamera.querySelector('.breeding-timer')

    this.timer = new Timer(timerEl)
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

    for ( let timeout of this.timeouts ) {
        clearTimeout(timeout)
    }

    this.cryogenicEl.className = 'cryogenic'

    sliders.cryo.enable()

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
    const revealSplash = this.cryogenicEl.querySelector('.reveal-splash')
    const revealSplashClone = revealSplash.cloneNode(false)
    revealSplash.remove()
    this.cryogenicEl.prepend(revealSplashClone)

    breedingState.step = 'start'
    breeding.checkReady()
}
Breeding.prototype.finish = function(opened) {
    this.cryogenicEl.className = 'cryogenic in-progress completed' + (opened ? ' opened' : '')
    this.sounds.complete.play()
    this.sounds.robot.pause()

    this.timeoutFunc(function() {
        this.cryogenicEl.classList.add('on')
    }, 100)

    this.timeoutFunc(function() {
        this.cryogenicEl.className = 'cryogenic completed ' + (opened ? 'opened' : 'on')
    }, 1100)

    breedingState.step = 'completed'
}
Breeding.prototype.open = function(data) {
    this.reload()
    wallet.close()

    breedingState.status = true
    breedingState = {...breedingState, ...data}
    breedingState.parents = data.parents.split(',')

    sliders.cryo.goToSlideById(breedingState.parents)
    sliders.cryo.disable()

    this.cryogenicEl.className = 'cryogenic ' + breedingState.step  + ' opened'

    if ( breedingState.step === 'in-progress' ) {
        this.sounds.robot.play()

        const potionTitle = this.cryogenicEl.querySelector('.potion .potion__title b')
        potionTitle.innerHTML = '#' + breedingState.potion

        const timerEl = creoCamera.querySelector('.breeding-timer')

        this.timer = new Timer(timerEl, breedingState.datestart)
        this.timer.start(this.finish.bind(this, true))
    }

    if ( breedingState.step === 'completed' ) {
        this.sounds.complete.play()
    }

    if ( breedingState.step === 'reveal' ) {
        const revealResult = document.querySelector('.reveal-results')
        revealResult.querySelector('.reveal-results__title span').innerHTML = breedingState.potion
    }
}
Breeding.prototype.reveal = function(id) {

    breedingState.step = 'reveal'
    this.cryogenicEl.className = 'cryogenic prereveal'
    this.timeoutFunc(function(){
        this.sounds.glass.play()
    }, 50)
    this.cryogenicEl.querySelector('.reveal-results__title span').innerHTML = breedingState.potion
    breeding.changePreview(id, 'images/temp/baby1.png')

    this.timeoutFunc(function(){
        this.cryogenicEl.className = 'cryogenic reveal'

        this.timeoutFunc(function(){
            this.cryogenicEl.classList.add('on')
            this.sounds.reveal.play()
        }, 300)
    }, 2100)

}
Breeding.prototype.checkReady = function() {

    const plateNotReady = this.cryogenicEl.querySelector('.plate.not-ready-for-breeding')
    const plateNotReadyParent = this.cryogenicEl.querySelector('.plate.not-ready-parent')
    const plateReady = this.cryogenicEl.querySelector('.plate.ready-for-breeding')
    const editGenesBTN = this.cryogenicEl.querySelector('.btn_type_genes')

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

    if ( breedingState.status ) {
        editGenesBTN.classList.add('show')
    } else {
        editGenesBTN.classList.remove('show')
    }

    return breedingState.status
}
Breeding.prototype.preview = function(babyid) {
    return `<div class="swiper-slide nft-item nft-preview nft-list__card" 
                    data-babyid="${babyid}" 
                    data-potion="${breedingState.potion}"
                    data-parents="${breedingState.parents}"
                    data-datestart="${breedingState.datestart}"
                    data-step="in-progress">
                    
                    <div class="nft-item__img">
                        <div class="nft-item__indicator nft-item__timer">:</div>
                        <img src="images/new-nft.svg" alt="" />
                    </div>
                    <div class="nft-item__description">
                        <div class="nft-card__title">${'Gen-Q Baby <br/>#' + breedingState.potion}</div>
                        <div class="nft-item__progress-bar">
                            <div class="nft-item__progress-bar__handler" style="width: 0%"></div>
                        </div>
                    </div>
                </div>`
}
Breeding.prototype.previewTimer = function(babyid) {
    const previews = document.querySelectorAll('.nft-preview[data-babyid="' + babyid + '"]')

    previews.forEach(function(e) {
        const timerEl = e.querySelector('.nft-item__timer')
        const timer = new Timer(timerEl, new Date())

        timer.start(function() {
            const revealButton = document.createElement('div')
            revealButton.className = 'nft-item__indicator nft-item__reveal'
            revealButton.innerHTML = 'Reveal Now!'
            revealButton.dataset.id = babyid
            timerEl.remove()
            e.querySelector('.nft-item__img').prepend(revealButton)
            e.querySelector('.nft-item__progress-bar').classList.add('finished')
            e.dataset.step = 'completed'
        })
    })
}
Breeding.prototype.changePreview = function(babyid, image) {
    const previews = document.querySelectorAll('.nft-preview[data-babyid="' + babyid + '"]')

    previews.forEach(function(preview) {
        preview.dataset.step = 'reveal'
        preview.querySelector('.nft-item__indicator').classList.add('d-none')
        preview.querySelector('.nft-item__progress-bar').classList.add('d-none')
        preview.querySelector('.nft-item__img img').src = image
    })
}
const breeding = new Breeding()

//Swipers
const sliders = {
    scroll: {
        slider: null,
        init: function() {
            this.slider = new Swiper('.swiper-scroll', {
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
                                sliders.nft.checkEmpty(swiper)
                            }
                        }
                    })
                )
            })
        },

        checkEmpty: function(swiper) {
            const swiperOverflow = swiper.$el.closest('.swiper-overflow')[0]
            if ( swiperOverflow ) {
                if ( !swiper.slides.length ) {
                    swiperOverflow.classList.add('empty')
                } else {
                    swiperOverflow.classList.remove('empty')
                }
            }
        },
        appendSlide: function(babyid) {
            this.array[1].prependSlide([breeding.preview(babyid)])
            sliders.scroll.slider.prependSlide([breeding.preview(babyid)])

            sliders.nft.checkEmpty(this.array[1])
            breeding.previewTimer(babyid)
        },
    },
    cryo: {
        array: [],
        init: function(el) {
            el.forEach((e, i) => {
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
                            stretch: 192,
                        },
                        on: {
                            slideChange: function() {
                                breeding.checkReady()
                                breedingState.parents[i] = e.swiper.slides[e.swiper.activeIndex].dataset.id
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
            const walletSlides = sliders.scroll.slider.el.querySelectorAll('.swiper-slide')
            walletSlides.forEach(function(e) {

                if ( e.classList.contains('nft-list__card_male') ) {
                    if ( e.dataset.id == breedingState.parents[0] )
                        e.classList.add('locked')
                }

                if ( e.classList.contains('nft-list__card_female') ) {
                    if ( e.dataset.id == breedingState.parents[1] )
                        e.classList.add('locked')
                }
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
        },
        goToSlideById: function( parents ) {

            this.array.forEach(function(e, i) {
                for ( let slide in e.slides ) {
                    if ( e.slides[slide].dataset.id === parents[i] ) {
                        e.slideTo(slide)
                        break
                    }
                }
            })
        }
    }
}
sliders.scroll.init()
sliders.nft.init(document.querySelectorAll('.swiper'))
sliders.cryo.init(document.querySelectorAll('.cryo-swiper'))

//Genes Initiate
function initiateBreeding() {
    this.popup = document.getElementById('editGenesPopup')
    this.button = document.getElementById('InitiateBreeding')
    this.errors = false
}
initiateBreeding.prototype.start = function() {
    this.popup.classList.add('show')

    if ( !babiesOptions[breedingState.potion] ) {
        babiesOptions[breedingState.potion] = {
            background: null,
            body: null,
            head: null,
            clothes: null,
            mouth: null,
            nose: null,
            eyes: null
        }
    }
    this.check()
}
initiateBreeding.prototype.check = function() {
    this.errors = false
    for ( let option in babiesOptions[breedingState.potion] ) {

        if (!babiesOptions[breedingState.potion][option]) this.errors = true

        const options = this.popup.querySelectorAll('.options-list__item[data-option="' + option + '"]')

        options.forEach(item => {

            const accordionItem = item.closest('.accordion__item')

            if ( item.dataset['optionItem'] === babiesOptions[breedingState.potion][option] ) {

                item.classList.add('checked')
                accordionItem.classList.add('option_checked')

            } else {

                item.classList.remove('checked')

                if (!babiesOptions[breedingState.potion][option])
                    accordionItem.classList.remove('option_checked')
            }
        })
    }

    if ( this.errors ) {
        this.button.classList.remove('show')
    } else {
        this.button.classList.add('show')
    }
}

initiateBreeding.prototype.chose = function(e) {

    const item = e.target.closest('[data-option]')
    const option = item.dataset.option
    const optionValue = item.dataset.optionItem

    babiesOptions[breedingState.potion][option] = optionValue

    this.check()
}

initiateBreeding.prototype.close = function() {
    this.popup.classList.remove('show')
}

const initiate = new initiateBreeding()


//EventListeners
cryogenicEl.addEventListener('click', function(e) {
    if ( !breedingState.status ) return false
    if ( e.target.closest('#startBreeding') ) breeding.start()
    if ( e.target.closest('#startInitiate') ) initiate.start()
})

potionsSlider.addEventListener('click', function(e) {
    const potion = e.target.closest('.swiper-slide')

    if ( potion ) {
        if ( !potion.classList.contains('locked') ) {
            if ( breedingState.step !== 'potion-checked' ) {
                potion.classList.add('locked')
                breedingState.step = 'potion-checked'
                breedingState.potion = potion.dataset.id
                breeding.checkReady()
            }
        } else {
            if ( potion.dataset.id === breedingState.potion && breedingState.lockedPotions.indexOf(breedingState.potion) < 0 ) {
                potion.classList.remove('locked')
                breedingState.step = 'start'
                breedingState.potion = null
                breeding.checkReady()
            }
        }
    }

})

document.addEventListener('click', function(e) {
    const previews = e.target.closest('.nft-preview')
    if ( previews ) breeding.open(previews.dataset)
})

breedingNew.addEventListener('click', function(e){
    e.preventDefault()
    breeding.reload()
})

revealNow.addEventListener('click', function(e){
    e.preventDefault()
    breeding.reveal(breedingState.babyid)
})

document.addEventListener('click', function(e){
    const target = e.target.closest('.btn_type_use')
    if ( target ) {
        e.preventDefault()

        if ( target.classList.contains('btn_type_use_male') ) {
            breedingState.parents[0] = target.closest('[data-id]').dataset.id
        }
        if ( target.classList.contains('btn_type_use_female') ) {
            breedingState.parents[1] = target.closest('[data-id]').dataset.id
        }

        wallet.close()
        sliders.cryo.goToSlideById(breedingState.parents)
    }
})

//Options Listener
document.addEventListener('click', function(e) {
    const target = e.target

    if ( target.closest('.options-list__item') ) initiate.chose(e)

    if ( target.closest('.popup') && !target.closest('.popup__content') ) {

        initiate.close()
    }

})
