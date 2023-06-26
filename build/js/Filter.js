export default class Filter{
    constructor() {
        this.text = document.querySelector('#visit-text').value
        this.doctor = document.querySelector('#doctor').value
        this.urgency = document.querySelector('#urgency').value
        this.myfilter = {
            text: this.text,
            doctor: this.doctor,
            urgency: this.urgency,
        }
    }
    makeFilter() {
        const newFilter = {}
        for (let key in this.myfilter) {
            if (this.myfilter[key] !== '') {
                newFilter[key] = this.myfilter[key].toLowerCase()
            }
        }
        const renderedVisits = document.querySelectorAll('.card');
        renderedVisits.forEach(card => {
            let cardCheck = 0
            if (Object.keys(newFilter).length === 0) {
                    card.style.display = 'block'
            } else {
                for (let key in newFilter) {
                    let cardString = ''
                    card.querySelectorAll(`[name="${key}"]`).forEach(elem => {
                        cardString += (elem.textContent.toLowerCase() + " ")
                    })
                    if (cardString.includes(newFilter[key])) {
                            cardCheck++
                    } 
                }
                if (cardCheck === Object.keys(newFilter).length) {
                    card.style.display = 'block'
                } else {
                    card.style.display = 'none'
                }    
            }
        })
    }
}