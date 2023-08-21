import { getEventLocation,getAsteroidName, getAsteroidTimes} from "./nasaInfo";
import { getCurrentLocation } from "./location";
import { getNasaAPI } from "./asteroidCalculations";
import { plotCoordinates } from "./index";

const country = document.getElementById("country");
const region = document.getElementById("region");
const city = document.getElementById("city");

const message = document.getElementById("message");
let calender_year_header = document.getElementById("year")

isLeapYear = (year) => {
    return (year %4 === 0 && year %100 !== 0 && year %400 !== 0) || (year %100 === 0 && year %400 === 0)
}


//check the leap year
getFebDays = (year) =>{
    return isLeapYear(year) ? 29 : 28
}

let calender = document.querySelector(".calender");
const months = ["January", "Febuary", "March" , "April" , "May", "June", "July", "August" ,"September" ,"October","November", "December"];

let monthPicker = document.getElementById("month_picker")

//generate the rest of the calender






export function getCalender(month,year) {
    let calender_day = document.querySelector(".calender_days")
    calender_day.innerHTML = ""
    

    let days_of_month = [31, getFebDays(year), 31,30,31,30,31,31,30,31,30,31];

    monthPicker.innerHTML = months[month];
    calender_year_header.innerHTML = year;



    let currentDay = new Date();
    let firstDay = new Date(year, month, 1)

    
    for (let i = 0; i <= days_of_month[month] + firstDay.getDay() -1 ; i++) {

        let day = document.createElement('div');
        if (i >= firstDay.getDay()){

            day.classList.add('calander_day_hover')
            day.innerHTML = i - firstDay.getDay() + 1
            day.innerHTML += `<span></span><span></span><span></span><span></span>`
            



            day.addEventListener("click", function(){

                let selectedDay = (day.innerHTML).substring(0, (day.innerHTML).indexOf("<"));



                if (country.value.length == 0 || region.value.length == 0 || city.value.length == 0){
                    setTimeout(() => {
                        
                        // 👇️ hides element (still takes up space on the page)
                        message.style.visibility = 'hidden';
                      }, 3000);
                    message.style.visibility = "visible"
                } else {

                    day.innerHTML = selectedDay + `<span style="height:100%"></span><span style="width:100%"></span><span style="height:100%"></span><span style="width:100%"></span>`
                    


                    return getEventLocation(selectedDay, months.indexOf(monthPicker.innerHTML) + 1, calender_year_header.innerHTML).then(info =>{
                        
                        
                        var asteroids = getAsteroidName(info)
                        var coordinates = []
                        var asteroidTimes = getAsteroidTimes(info);
                        var currentLocation = getCurrentLocation(country.value, region.value, city.value)
                        const asteroidAmount = asteroids.length;
                        
                        currentLocation.then((location) => {
                            const lat = location.geometry.lat;
                            const lng = location.geometry.lng;
                            for (let i = 0; i < asteroidAmount; i++){
                                var url = getNasaAPI(`https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${asteroids[i].replaceAll(" ","%20")}`, lat,lng);
                                url.then((coords) => {
                                    
                                    coordinates.push(coords)
                                })
                                


                            }


                            plotCoordinates(coordinates, asteroidAmount, asteroids, asteroidTimes)
                            

                        })

                    })

                }

            })

            
            

            if (i - firstDay.getDay() + 1 === currentDay.getDate() && year === currentDay.getFullYear() && month === currentDay.getMonth()){
                day.classList.add("current_day")
            }
        }  
        calender_day.appendChild(day);
    }


}






monthPicker.onclick = () =>{
    monthList.classList.add("show");
    
}


document.getElementById("prev_year").onclick = () =>{
    calender_year_header.innerHTML--;
    getCalender(months.indexOf(monthPicker.innerHTML), calender_year_header.innerHTML);

}

document.getElementById("next_year").onclick = () =>{
    calender_year_header.innerHTML++;
    getCalender(months.indexOf(monthPicker.innerHTML), calender_year_header.innerHTML);

}



let monthList = calender.querySelector(".month_list");
months.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`
    month.onclick = () => {
        monthList.classList.remove("show");

        
        getCalender(index, calender_year_header.innerHTML);
        
    }
    monthList.appendChild(month)
})

