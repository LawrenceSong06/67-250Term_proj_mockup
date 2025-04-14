import * as Views from './calendar/main_views.js';
import * as Random from '../global/lib/random.js';
import * as TaskBoard from "./calendar/task_board.js";
import * as Std_date from "../global/lib/std_date.js";
import * as Operations from "../global/lib/operations.js"

var lorem_ipsum_source = "../static/data/lorem_ipsum.txt";

// Private
async function fill_with_random_tasks(num){
    await Random.get_lorem_ipsum(lorem_ipsum_source)
    .then(response=>{
        return TaskBoard.random_task_list(num);
    }).then(data=>{
        let task_dates = [];
        let task_day_elements = [];
        let last_Sun = Std_date.find_day(new Date(),0,-1);
        let week = TaskBoard.fill_week(last_Sun);
        task_day_elements = task_day_elements.concat(week.week);
        task_dates = task_dates.concat(week.dates);

        let res = TaskBoard.creat_task_list(data);
        res.forEach(task => {
            let task_date = Std_date.convert_date(new Date(task.querySelector("time").dateTime)).YYYY_MM_DD;
            let target_date = task_dates.indexOf(task_date);
            if(target_date == -1){
                task_dates.push(task_date);
                task_day_elements.push(TaskBoard.create_day(new Date(task_date)));
                target_date = task_dates.length-1;
            };
            task_day_elements[target_date].querySelector('ul').append(task);
        });

        task_day_elements.sort((a,b)=>{
            return new Date(a.querySelector("time").dateTime).getTime() - new Date(b.querySelector("time").dateTime).getTime();
        })       

        let frag = document.createDocumentFragment();
        task_day_elements.forEach(element => {
            frag.append(element);
        });
        document.querySelector(".task_board").append(frag);
    }).catch(err=>console.error(err));
}

function all_checkboxes_change_to(element_list,value){
    element_list.forEach(element => {
        element.checked = value;
    });
}

function toggle_select_all(self, element_list){
    if(self.checked) all_checkboxes_change_to(element_list,1);
    else all_checkboxes_change_to(element_list,0);
}

// Public
window.change_view = Views.change_view;
window.toggle_class = Operations.toggle_class;
window.activate_only = Operations.activate_only;
window.toggle_activity = Operations.toggle_activity;
window.get_ids = Operations.get_ids;
window.apply_filters = TaskBoard.apply_filters;
window.all_checkboxes_change_to = all_checkboxes_change_to;
window.toggle_select_all = toggle_select_all;

// Main 
fill_with_random_tasks(100).then(response=>{
    TaskBoard.apply_groups(TaskBoard.get_default_group_ids());
    let filters = TaskBoard.get_filter_list(TaskBoard.get_default_group_ids());
    let frag = document.createDocumentFragment();
    filters.forEach(f => {
        frag.appendChild(f);
    });
    document.querySelector("#filters ul").appendChild(frag);
});