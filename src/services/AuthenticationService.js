import Base64 from "Base64";

const AUTH = "http://yourshares.tk/auth";

export function loginWithEmail(email, password) {
    const credentials = Base64.btoa(`${email}:${password}`);
    return fetch(AUTH, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Basic ${credentials}`
        },
    })
        .then(response => response.json())
        .catch(error => console.error(`loginWithEmail: ${error}`))
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
        .then(response => {
            const status = response.status;
            return status === 200;
        })
        .catch(error => console.log(`registerWithEmail: ${error}`))
}