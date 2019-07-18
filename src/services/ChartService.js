const API = "https://bar-chart-api.herokuapp.com/plot.png";

export function getChart(data) {
    return fetch(API, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}