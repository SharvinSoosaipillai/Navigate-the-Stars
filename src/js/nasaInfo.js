// remember to explain why you aren't using express to store the api key (you don't know express)
const api_key = "API_KEY"
const now = new Date();


export function getEventLocation(day, month, year){
    var information = updateURL(getDateSelected(day, month, year), getCurrentDay())
    return fetch(information)
        .then(res => res.json())
        .then(data => {
            const {
                element_count,
                near_earth_objects,
                ...locData
            } = data;


            return Object.entries(near_earth_objects).map(([date, data]) =>{
                return {
                    date: date,
                    asteroids: data,
                }
            })
            
            
        })
}



export function getAsteroidName(info){
    let asteroidList = [];

    for (let i = 0; i < info.length; i++){
        for (let j = 0; j < info[i].asteroids.length; j++){
            if (info[i].asteroids[j].name.indexOf("(") == -1 && info[i].asteroids[j].name.indexOf(")") == -1){
                asteroidList.push(info[i].asteroids[j].name)
            } else {
                asteroidList.push((info[i].asteroids[j].name).substring(0, info[i].asteroids[j].name.indexOf("(")) + (info[i].asteroids[j].name).substring(info[i].asteroids[j].name.indexOf("(")+ 1, info[i].asteroids[j].name.indexOf(")")))
            }
        }
        
    }

    return (asteroidList);

}

export function getAsteroidTimes (info){
    var asteroidTimes = []

    for (let i = 0; i < info.length; i++){
        for (let j = 0; j <info[i].asteroids.length; j++ ){

            var estimatedDiameter = (info[i].asteroids[j].estimated_diameter.kilometers.estimated_diameter_max + info[i].asteroids[j].estimated_diameter.kilometers.estimated_diameter_min)/2

            asteroidTimes.push([info[i].asteroids[j].close_approach_data[0].close_approach_date_full, estimatedDiameter])
        }

    }

    return(asteroidTimes)
}









function getCurrentDay(){
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month <= 9){
        month = "0"+ (now.getMonth() + 1)
    } 
    
    if (day <= 9){
        day = "0" + now.getDate();
    }

    return now.getFullYear() + "-" + (month) + "-" + (day)
}


function getDateSelected(day, month, year){
    if (month <= 9){
        month = "0"+ month
    } 
    
    if (day <= 9){
        day = "0" + day
    }

    return year + "-" + (month) + "-" + (day)

}

function updateURL(dateSelected, currentDate){
    var selectedDateArray = dateSelected.split("-")
    var currentDayArray = currentDate.split("-")
    let future = false;

    for (let i = 0; i < selectedDateArray.length; i++){
        if (selectedDateArray[i] > currentDayArray[i]){
            future = true;
        }
    }
    

    //do a conditional statement at the very end to check to 
    
    if (future){

        return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${currentDate}&end_date=${dateSelected}&api_key=${api_key}`

    }else {

        return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateSelected}&end_date=${currentDate}&api_key=${api_key}`
    }
    
}



