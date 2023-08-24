export function getCurrentLocation(country, province, city) {
    const apiKey = process.env.LOCATION_API_KEY; // Make sure the environment variable is set

    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(city + " " + province + " " + country)}&key=${apiKey}&pretty=1`;

    return fetch(apiUrl)
        .then(res => res.json())
        .then(data => {

            return data.results[0];
        });
}
