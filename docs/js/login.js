const loginArea = document.querySelector('.login-area')
const loginBtn = document.getElementById('loginBtn')
const logoutBtn = document.getElementById('logoutBtn')

function Auth() {
    this.step = 0
    this.area = loginArea
}

Auth.prototype.switchStep = function(duration) {

    if ( duration === 'next' ) {
        this.step++
    } else {
        this.step--
    }
    const area = this.area
    const steps = area.querySelectorAll('[class^="step_"]')

    area.className = `login-area step_${this.step}`

    steps.forEach(function(e){
        e.classList.remove('show')
    })
    this.area.querySelector(`.step_${this.step}`).classList.add('show')
}

Auth.prototype.login = function() {
    this.switchStep('next')
}

Auth.prototype.logout = function() {
    this.switchStep('prev')
}

const auth = new Auth()

loginBtn.addEventListener('click', function(e) {
    e.preventDefault()
    auth.login()
})
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault()
    auth.logout()
})
loginArea.addEventListener('click', function(e) {

    if ( e.target.classList.contains('controls-buttons-next') ) {
        e.preventDefault()
        auth.switchStep('next')
    }
    if ( e.target.classList.contains('controls-buttons-prev') ) {
        e.preventDefault()
        auth.switchStep('prev')
    }

})
