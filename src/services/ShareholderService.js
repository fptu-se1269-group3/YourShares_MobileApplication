import strings from "../values/Strings";

const SHAREHOLDERS = `${strings.BASE_PATH}api/shareholders`;
const SHAREHOLDERS_COMPANIES = `${strings.BASE_PATH}api/shareholders/companies`;
const SHAREHOLDERS_USERS = `${strings.BASE_PATH}api/shareholders/users`;

export function getShareholder(id, token) {
    return fetch(`${SHAREHOLDERS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function getShareholderByCompany(id, token) {
    return fetch(`${SHAREHOLDERS_COMPANIES}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function getShareholderByUser(id, token) {
    return fetch(`${SHAREHOLDERS_USERS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function searchShareholderByName(name, token) {
    return fetch(`${SHAREHOLDERS_USERS}?name=${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function createShareholder(shareholder, token) {
    return fetch(`${SHAREHOLDERS}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shareholder)
    })
}