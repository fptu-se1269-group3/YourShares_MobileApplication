const COMPANIES = "http://yourshares.tk/api/companies";

export function getCompany(id, token) {
    return fetch(`${COMPANIES}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .catch(error => console.error(`getCompany: ${error}`))
}

export function createCompany(company, token) {
    return fetch(`${COMPANIES}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(company)
    })
        .then(response => response.json())
        .catch(error => console.error(`createCompany: ${error}`))
}
