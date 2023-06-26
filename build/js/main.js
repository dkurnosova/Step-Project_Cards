import Modal from "./Modal.js"
import { Cards } from './Visit.js';
import Filter from "./Filter.js";

export const headerBtn = document.querySelector('.header-btn')

const filter = document.querySelector('.filter')
filter.addEventListener('submit', (event) => {
    event.preventDefault()
    new Filter().makeFilter()
})

if (localStorage.getItem('token')) {
    headerBtn.textContent = 'Створити візит'
    new Cards().renderAll()
}

headerBtn.addEventListener('click', () => {
    if (headerBtn.textContent === "Вхід") {
        new Modal(document.body).enter()     
    } else{
        new Modal(document.body).visitCreateNew()
    }
})

