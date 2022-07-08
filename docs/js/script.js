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

//Swipers
const dropdownScroll = new Swiper('.swiper-scroll', {
    direction: "vertical",
    slidesPerView: "auto",
    freeMode: true,
    scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true
    },
    mousewheel: true,
})

const swipers = document.querySelectorAll('.swiper')
const cryoSwipers = document.querySelectorAll('.cryo-swiper')

const cryoSwipersArray = []
const swipersArray = []
swipers.forEach(e => {
    swipersArray.push(
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
                init: function(el) {
                    if ( !el.slides.length ) {
                        el.$el.closest('.swiper-overflow')[0].classList.add('empty')
                    } else {
                        el.$el.closest('.swiper-overflow')[0].classList.remove('empty')
                    }
                }
            }
        })
    )
})
cryoSwipers.forEach(e => {
    cryoSwipersArray.push(
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
        })
    )
})

//CreoCamera

const creoCamera = document.getElementById('creoCamera')

function Cryogenic() {
    this.cryogenicEl = document.querySelector('.cryogenic')

    this.sounds = {}
    this.sounds.water = new Audio('audio/01_sound_water.mp3')
    this.sounds.splash = new Audio('audio/02_sound_splash.mp3')
    this.sounds.robot = new Audio('audio/05_sound_robot.mp3')
    this.sounds.robot.loop = true
    this.sounds.mutant1 = new Audio('audio/03_sound_mutant.mp3')
    this.sounds.mutant2 = new Audio('audio/04_sound_mutant.mp3')
}
Cryogenic.prototype.start = function() {
    this.cryogenicEl.classList.add('started')
    this.cryogenicEl.classList.add('step_1')
    this.sounds.water.play()

    setTimeout(function() {
        this.cryogenicEl.classList.add('embrion-start')
        this.cryogenicEl.classList.add('splash_1_start')

        setTimeout(function() {
            this.cryogenicEl.classList.add('on')

        }.bind(this), 50)

        setTimeout(function () {
            this.sounds.splash.play()
        }.bind(this), 400)

        setTimeout(function () {
            this.sounds.robot.play()

        }.bind(this), 600)

    }.bind(this), 3500)

    setTimeout(function() {
        this.cryogenicEl.classList.remove('splash_1_start')
        this.cryogenicEl.classList.add('splash_2_start')

        setTimeout(function () {
            this.sounds.mutant1.play()
        }.bind(this), 400)

    }.bind(this), 4500)

    setTimeout(function() {
        this.cryogenicEl.classList.remove('splash_2_start')
        this.cryogenicEl.classList.add('splash_3_start')

        setTimeout(function () {
            this.sounds.mutant2.play()
        }.bind(this), 400)

    }.bind(this), 5500)

    setTimeout(function() {
        this.cryogenicEl.classList.remove('step_1')
        this.cryogenicEl.classList.add('step_2')
    }.bind(this), 6000)

    setTimeout(function() {
        this.cryogenicEl.className = 'cryogenic in-progress'
    }.bind(this), 6300)
}
const cryogenic = new Cryogenic()

creoCamera.addEventListener('click', function(e) {
    if ( !creoCamera.classList.contains('not-active') ) {
        cryogenic.start()
        creoCamera.classList.add('not-active')
    }

})
