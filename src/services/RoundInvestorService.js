import strings from "../values/Strings";

const ROUNDS_INVESTORS = `${strings.BASE_PATH}api/round-investors`;
const ROUND_INVESTORS_ROUNDS = `${strings.BASE_PATH}api/round-investors/rounds`;

export function getRoundInvestor(id, token) {
    return fetch(`${ROUNDS_INVESTORS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .catch(error => console.error(`getRoundInvestor: ${error}`))
}

export function getRoundInvestorByRound(id, token) {
    return fetch(`${ROUND_INVESTORS_ROUNDS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .catch(error => console.error(`getRoundInvestorByRound: ${error}`))
}

export function createRoundInvestor(roundInvestor, token) {
    return fetch(`${ROUNDS_INVESTORS}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roundInvestor)
    })
        .then(response => response.json())
        .catch(error => console.error(`createRoundInvestor: ${error}`));
}