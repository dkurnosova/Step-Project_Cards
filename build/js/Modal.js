import Requests from './Requests.js';
import { headerBtn } from './main.js';
import { VisitDentist, VisitTherapist, VisitCardiologist, Cards } from './Visit.js';
import Filter from './Filter.js';

export const cardContainer = document.querySelector('.cards-container');

export default class Modal {
	constructor(container) {
		this.container = container
		const formEnterTemplate = document.querySelector('#form-template').content;
		this.formWrap = formEnterTemplate.querySelector('.form').cloneNode(true);
		this.form = this.formWrap.querySelector('form');
		this.inputsContainer = this.formWrap.querySelector('.inputs-container');
		this.formWrap.addEventListener('mousedown', event => {
			if (
				event.target.classList.contains('form') ||
				event.target.classList.contains('close-form')
			) {
				this.formWrap.remove();
			}
		});
		this.container.prepend(this.formWrap)
	}

	enter() {
		const enterFillingTemplate = document.querySelector('#form_enter-filling').content;
		const formEnter = enterFillingTemplate.cloneNode(true);
		this.inputsContainer.append(formEnter);
		this.form.addEventListener('submit', event => {
			event.preventDefault();
			const email = this.form.querySelector('.user-email').value;
			const password = this.form.querySelector('.user-password').value;
			const userData = {
				email,
				password,
			};
			Requests.enter(userData).then(token => {
				localStorage.setItem('token', token)
				this.formWrap.remove();
				headerBtn.textContent = 'Створити візит';
				new Cards().renderAll()
			}).catch(err => alert(err.message))
		});
	}

	visitCreateNew() {
		this._renderVisitModal('Заповніть поля для створення нового запису')
		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			const visit = this._createVisitObject()
			Requests.post(visit).then(data => {
				this.formWrap.remove();
				if (cardContainer.classList.contains('empty')) {
					cardContainer.textContent = ''
					cardContainer.classList.remove('empty')
				}
				const { doctor } = data;
				if (doctor === 'Стоматолог') {
					new VisitDentist(data).render(cardContainer);
				} else if (doctor === 'Кардіолог') {
					new VisitCardiologist(data).render(cardContainer);
				} else if (doctor === 'Терапевт') {
					new VisitTherapist(data).render(cardContainer);
				}
			}).catch(err => alert(err.message));
		});
	}

	visitEdit(visitObject) {
		const { doctor, name, origins, purposeVisit, description, pressure, indexMassa, ill, age, lastVisit, id } = visitObject
		this._renderVisitModal('Відкоригуйте необхідну інформацію про візит', doctor, name, origins, purposeVisit, description, pressure, indexMassa, ill, age, lastVisit)
		this.form.addEventListener('submit', e => {
			e.preventDefault();
			const visit = this._createVisitObject()
			Requests.put(visit, id).then(visitEditObj => {
				this.formWrap.remove()
				const { doctor } = visitEditObj
				const cardForEdit = cardContainer.querySelector(`[data-id="${id}"]`)
				const addInfo = cardForEdit.querySelectorAll('.visit__add-info')
				addInfo.forEach(doctorContainer => doctorContainer.classList.remove('active'))
				for (let key in visitEditObj) {
					if (key !== 'id') {
						const elemForEdit = cardForEdit.querySelector(`[data-edit="${key}"]`)
						elemForEdit.textContent = visitEditObj[key]
					}
				}
				if (doctor === 'Стоматолог') {
					cardForEdit.querySelector('.visit__add-info-dentist').classList.add('active')
					cardForEdit.style.backgroundColor = 'rgba(101, 235, 183, 0.5)';
				} else if (doctor === 'Кардіолог') {
					cardForEdit.querySelector('.visit__add-info-cardio').classList.add('active')
					cardForEdit.querySelector('.visit__add-info-age').classList.add('active')
					cardForEdit.style.backgroundColor = 'rgba(205, 210, 497, 0.5)'
				} else if (doctor === 'Терапевт') {
					cardForEdit.querySelector('.visit__add-info-age').classList.add('active')
					cardForEdit.style.backgroundColor = 'rgba(39, 170, 219, 0.5)'
				}
				new Filter().makeFilter()
			}).catch(err => alert(err.message));
		});
	}

	_createVisitObject() {
		const visit = {
			name: this.patientName.value,
			purposeVisit: this.purposeVisit.value,
			description: this.description.value,
			origins: this.origins.value,
			doctor: this.selectDoctor.value,
		};

		switch (this.selectDoctor.value) {
			case 'Кардіолог':
				visit.pressure = this.pressure.value;
				visit.indexMassa = this.indexMassa.value;
				visit.ill = this.ill.value;
				visit.age = this.age.value;
				break;
			case 'Стоматолог':
				visit.lastVisit = this.lastVisit.value;
				break;
			case 'Терапевт':
				visit.age = this.age.value;
				break;
			default:
				break;
		}
		return visit
	}

	_renderVisitModal(modalTitle, doctor = '', name = '', origins = '', purposeVisit = '', description = '', pressure = '', indexMassa = '', ill = '', age = '', lastVisit = '') {
		const formTitle = document.createElement('h3');
		formTitle.textContent = modalTitle

		this.selectDoctor = document.createElement('select');

		const btnSubmit = document.createElement('input');
		btnSubmit.classList.add('submit');
		btnSubmit.type = 'submit';
		btnSubmit.value = 'Зберегти візит';

		this.selectDoctor.innerHTML = ` 
			<option value="Стоматолог">Стоматолог</option>
            <option value="Кардіолог">Кардіолог</option>
            <option value="Терапевт">Терапевт</option>`;
		const labelSelectDoctor = document.createElement('label')
		labelSelectDoctor.textContent = 'Лікар:'
		labelSelectDoctor.append(this.selectDoctor)

		const dopInfoWrapper = document.createElement('div');
		dopInfoWrapper.className = 'additional-info';

		const cardioContainer = document.createElement('div')
		cardioContainer.className = 'additional-info__item'
		this.pressure = document.createElement('input');
		this.pressure.placeholder = 'Тиск';
		this.pressure.value = pressure
		const labelPressure = document.createElement('label')
		labelPressure.textContent = 'Звичайний тиск:'
		labelPressure.append(this.pressure)

		this.indexMassa = document.createElement('input');
		this.indexMassa.placeholder = 'ІМТ';
		this.indexMassa.value = indexMassa
		const labelIndexMassa = document.createElement('label')
		labelIndexMassa.textContent = 'Індекс маси тіла:'
		labelIndexMassa.append(this.indexMassa)

		this.ill = document.createElement('input');
		this.ill.placeholder = 'Захворювання';
		this.ill.value = ill
		const labelIll = document.createElement('label')
		labelIll.textContent = 'Перенесені захворювання серцево-судинної системи:'
		labelIll.append(this.ill)

		cardioContainer.append(labelPressure, labelIndexMassa, labelIll);

		const dentistContainer = document.createElement('div')
		dentistContainer.className = 'additional-info__item'
		this.lastVisit = document.createElement('input');
		this.lastVisit.setAttribute('type', 'date');
		this.lastVisit.value = lastVisit
		const labelLastVisit = document.createElement('label')
		labelLastVisit.textContent = 'Дата останнього візиту:'
		labelLastVisit.append(this.lastVisit)
		dentistContainer.append(labelLastVisit);

		const ageContainer = document.createElement('div')
		ageContainer.className = 'additional-info__item'
		this.age = document.createElement('input');
		this.age.placeholder = 'Вік';
		this.age.value = age
		const labelAge = document.createElement('label')
		labelAge.textContent = 'Вік пацієнта:'
		labelAge.append(this.age)
		ageContainer.append(labelAge);
		dopInfoWrapper.append(cardioContainer, dentistContainer, ageContainer)
		dopInfoWrapper.querySelectorAll('input').forEach(input => {
			input.required = false
			}
		)
		if (doctor === '') {
			this.selectDoctor.querySelector(`[value='Стоматолог']`).selected = "selected"
			dentistContainer.classList.add('active')
			dentistContainer.querySelector('input').required = true;
		} else {
			this.selectDoctor.querySelector(`[value='${doctor}']`).selected = "selected"
			switch (doctor) {
			case 'Кардіолог':
					cardioContainer.classList.add('active')
					cardioContainer.querySelectorAll('input').forEach(input => input.required = true)
					ageContainer.classList.add('active')
					ageContainer.querySelectorAll('input').forEach(input=>input.required = true)
			break;
			case 'Стоматолог':
				dentistContainer.classList.add('active')
				dentistContainer.querySelector('input').required = true;
			break;
			case 'Терапевт':
				ageContainer.classList.add('active')
				ageContainer.querySelector('input').required = true;
			break;
			}
		}

		this.selectDoctor.addEventListener('change', () => {
			const active = dopInfoWrapper.querySelector('.active')
			active.classList.remove('active')
			dopInfoWrapper.querySelectorAll('input').forEach(input=>input.required = false)
			switch (this.selectDoctor.value) {
			case 'Кардіолог':
					cardioContainer.classList.add('active')
					cardioContainer.querySelectorAll('input').forEach(input => input.required = true)
					ageContainer.classList.add('active')
					ageContainer.querySelectorAll('input').forEach(input=>input.required = true)
				break;
				case 'Стоматолог':
					dentistContainer.classList.add('active')
					dentistContainer.querySelector('input').required = true;
				break;
				case 'Терапевт':
					ageContainer.classList.add('active')
					ageContainer.querySelector('input').required = true;
				break;
		}
		})

		this.patientName = document.createElement('input');
		this.patientName.placeholder = 'П.І.Б.';
		this.patientName.value = name
		this.patientName.required = true;
		const labelPatientName = document.createElement('label')
		labelPatientName.textContent = 'П.І.Б. пацієнта:'
		labelPatientName.append(this.patientName)

		this.origins = document.createElement('select');
		this.origins.innerHTML = ` 
            <option value="Звичайна">Звичайна</option>
            <option value="Пріорітетна">Пріорітетна</option>
            <option value="Невідкладна">Невідкладна</option>`;
		this.origins.id = 'origins';
		if (origins !== '') {
			this.origins.querySelector(`[value='${origins}']`).selected = "selected"
		}

		const labelOrigins = document.createElement('label');
		labelOrigins.textContent = 'Терміновість візиту:';
		labelOrigins.for = 'origins';
		labelOrigins.append(this.origins);

		this.description = document.createElement('input');
		this.description.value = description
		this.description.placeholder = 'Опис візиту';
		this.description.required = true;
		const labelDescription = document.createElement('label')
		labelDescription.textContent = 'Короткий опис візиту:'
		labelDescription.append(this.description)

		this.purposeVisit = document.createElement('input');
		this.purposeVisit.value = purposeVisit
		this.purposeVisit.placeholder = 'Мета';
		this.purposeVisit.required = true;
		const labelPurposeVisit = document.createElement('label')
		labelPurposeVisit.textContent = 'Мета візиту:'
		labelPurposeVisit.append(this.purposeVisit)

		this.inputsContainer.append(
			formTitle,
			labelPatientName,
			labelPurposeVisit,
			labelDescription,
			labelOrigins,
			labelSelectDoctor,
			dopInfoWrapper,
			btnSubmit,
		);
	}
}
