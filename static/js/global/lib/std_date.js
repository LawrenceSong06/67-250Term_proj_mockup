import * as Random from "../../global/lib/random.js"
// Date
export function convert_date(date){
    let month_name = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let day_name = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    let YYYY = date.getFullYear().toString();
    let MM =  (date.getMonth()+1).toString();
    let DD = date.getDate().toString().padStart(2,"0");;
    let hh = date.getHours().toString().padStart(2,"0");
    let mm = date.getMinutes().toString().padStart(2,"0");
    let MM_DD = MM + "-" + DD;
    let YYYY_MM_DD = YYYY+"-"+MM_DD;
    let hh_mm = hh+":"+mm;
    let std_date = YYYY_MM_DD + "T" + hh_mm;
    return {
        "std_date":std_date,
        "YYYY_MM_DD":YYYY_MM_DD, 
        "hh_mm":hh_mm,
        "hh":hh,
        "mm":mm,
        "YYYY":YYYY,
        "MM_DD":MM_DD,
        "MM":MM,"DD":DD,
        "month_name":month_name[date.getMonth()],
        "day_name":day_name[date.getDay()]
    };
}

export function get_time_name(date){
    let h = date.getHours();
    if(h<6){
        return "Night";
    }else if(h<12){
        return "Morning";
    }else if(h<17){
        return "Afternoon";
    }else if(h<21){
        return "Evening";
    }else{
        return "Night";
    }
}

export function plus_day(date,n){
    return new Date(date.getTime() + n*(24 * 60 * 60 * 1000));
}
export function random_date_from(date,range){
    return plus_day(date,Random.random_int(-range,range));
}
export function find_day(date,day,direction){
    let curr = date;
    while(curr.getDay() != day){
        curr = plus_day(curr,parseInt(direction/Math.abs(direction)));
    }
    return curr;
}