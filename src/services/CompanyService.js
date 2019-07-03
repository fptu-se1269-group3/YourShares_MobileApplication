import strings from "../values/Strings";

const COMPANIES = `${strings.BASE_PATH}api/companies`;

export function getCompany(id, token) {
    return fetch(`${COMPANIES}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
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
}
