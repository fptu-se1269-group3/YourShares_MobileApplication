import strings from "../values/Strings";

const TRANSACTIONS = `${strings.BASE_PATH}api/transactions`;
const TRANSACTIONS_SHARE_ACCOUNTS = `${strings.BASE_PATH}api/transactions/share-accounts`;

export function getTransaction(id, token) {
    return fetch(`${TRANSACTIONS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}

export function getTransactionByShareAccount(id, token) {
    return fetch(`${TRANSACTIONS_SHARE_ACCOUNTS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
}
