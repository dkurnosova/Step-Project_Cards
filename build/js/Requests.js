const URL = 'https://ajax.test-danit.com/api/v2/cards/';

export default class Requests {
	static enter(object) {
		return fetch(URL + 'login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(object),
		}).then(response => {
            const { ok } = response
            if (ok) {
                return response.text()
            }
            throw new Error("Неправильна електронна адреса або пароль")
        });
	}

    static get(id = '') {
		return fetch(URL + id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}).then(response => {
            const { ok } = response
            if (ok) {
                return response.json()
            }
            throw new Error("Неможливо отримати дані з сервера")
        });
	}

    static post(object) {
		return fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify(object),
		}).then(response => {
            const { ok } = response
            if (ok) {
                return response.json()
            }
            throw new Error("Неможливо відправити дані на сервер")
        });
	}

    static put(object, id) {
		return fetch(URL + id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify(object),
		}).then(response => {
            const { ok } = response
            if (ok) {
                return response.json()
            }
            throw new Error("Неможливо зробити коригування запису")
        });
	}

    static delete(id) {
		return fetch(URL + id, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
	}
}