import Base64 from "Base64";
import strings from "../values/Strings";

const AUTH = `${strings.BASE_PATH}auth`;
const OAUTH = `${strings.BASE_PATH}oauth`;

export function loginWithEmail(email, password) {
    const credentials = Base64.btoa(`${email}:${password}`);
    return fetch(AUTH, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Basic ${credentials}`
        },
    })
}

export function registerWithEmail(register) {
    return fetch(AUTH, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(register)
    })
}

export function loginWithOAuth(id, auth) {
    return fetch(`${OAUTH}?auth=${auth}&id=${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    })
}

export function createProfileOAuth(user, auth) {
    return fetch(`${OAUTH}?auth=${auth}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
}