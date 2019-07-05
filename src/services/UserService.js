import strings from "../values/Strings";

const USERS = `${strings.BASE_PATH}api/users`;

export function getUser(id, token) {
    return fetch(`${USERS}/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export function updateUser(field, value, token) {
    return fetch(`${USERS}/${field}?value=${value}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}
