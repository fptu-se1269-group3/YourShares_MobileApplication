const API = "https://bar-chart-api.herokuapp.com/";

export function getChart(data) {
    return fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}