import strings from "../values/Strings";

const ROUNDS = `${strings.BASE_PATH}api/rounds`;
const ROUNDS_COMPANIES = `${strings.BASE_PATH}api/rounds/companies`;

export function getRound(id, token) {
    return fetch(`${ROUNDS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function getRoundByCompany(id, token) {
    return fetch(`${ROUNDS_COMPANIES}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function createRound(round, token) {
    return fetch(`${ROUNDS}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(round)
    })
}