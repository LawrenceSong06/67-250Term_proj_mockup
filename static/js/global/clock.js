import * as Std_date from "./lib/std_date.js"

var clock,date,time;
function update_clock(){
    date = new Date();
    time = 
        (date.getHours()>=13?(date.getHours()-12):date.getHours()).toString().padStart(2,"0") + ":" + 
        date.getMinutes().toString().padStart(2,"0") + "&nbsp;" + 
        (date.getHours()>=12?"P.M.":"A.M.");
    clock.innerHTML = time;
    clock.dateTime = Std_date.convert_date(date).std_date;
}

export function start_clock(){
    clock = document.querySelector("#clock");
    update_clock();
    var clock_refresh = setInterval(() => {
        update_clock();
    }, 1000);
}