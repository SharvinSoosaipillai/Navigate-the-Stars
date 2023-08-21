export function getCurrentLocation(country, province, city){
    
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(city + " "+  province + " "+ country)}&key="api_key"&pretty=1`)
    .then(res => res.json())
    .then(data => {

        return(data.results[0])

    })
}


