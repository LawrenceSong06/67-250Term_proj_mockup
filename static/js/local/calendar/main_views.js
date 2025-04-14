import * as Operations from "../../global/lib/operations.js";

var views = ["week-view","list-view"];
function get_curr_view(){
    let class_list = document.querySelector(".task_board").classList;
    for (let index = 0; index < views.length; index++) {
        const view = views[index];
        if (class_list.contains(view)){
            return view;
        } 
    }
    return null;
}

export function change_view(tar){
    let calendar = document.querySelector(".task_board");
    Operations.change_class(calendar,get_curr_view(),tar);
}