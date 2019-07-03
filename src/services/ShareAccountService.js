import strings from "../values/Strings";

const SHARE_ACCOUNTS = `${strings.BASE_PATH}api/share-accounts`;
const SHARE_ACCOUNTS_SHAREHOLDERS = `${strings.BASE_PATH}api/share-accounts/shareholders`;

export function getShareAccount(id, token) {
    return fetch(`${SHARE_ACCOUNTS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .catch(error => console.error(`getShareAccount: ${error}`))
}

export function getShareAccountByShareholder(id, token) {
    return fetch(`${SHARE_ACCOUNTS_SHAREHOLDERS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .catch(error => console.error(`getShareAccountByShareholder: ${error}`))
}

export function createShareAccount(shareAccount, token) {
    return fetch(`${SHARE_ACCOUNTS}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shareAccount)
    })
        .then(response => response.json())
        .catch(error => console.error(`createShareAccount: ${error}`))
}