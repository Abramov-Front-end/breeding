function Accordion() {
    this.containers = document.querySelectorAll('.accordion')
    this.items = []

    this.containers.forEach(accordion => {
        accordion.querySelectorAll('.accordion__item').forEach(item => {
            this.items.push(item)
        })

    })

    // this.items.forEach(function(e) {
    //     const optionsList = e.querySelector('.options-list')
    //     e.target.closest('.accordion__item__content').clientHeight = optionsList.clientHeight
    // })

}
Accordion.prototype.open = function(e) {

    this.items.forEach(function(item) {

        item.classList.remove('accordion__item_opened')

        if (item === e.target.closest('.accordion__item')) {
            item.classList.add('accordion__item_opened')
        }
    })
}
const accordion = new Accordion()

document.querySelectorAll('.accordion .accordion__item__header').forEach(function (header) {
    header.addEventListener('click', function(e){
        accordion.open(e)
    })
})

