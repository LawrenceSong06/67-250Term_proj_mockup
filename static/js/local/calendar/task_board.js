import * as Operations from "../../global/lib/operations.js";
import * as Random from "../../global/lib/random.js";
import * as Std_date from "../../global/lib/std_date.js"

// Group Object
var default_group_ids = [];
var group_list = [];
function Group(id,name, color){
    this.id = id;
    this.name = name;
    this.color = color;
    this.register = function(){
        default_group_ids.push(this.id);
        group_list[id] = this;
    };
    this.update = function(){
        group_list[id] = this;
    }
}
export function get_default_group_ids(){
    return default_group_ids;
}
new Group(0, "completed","var(--myGrey)").register();

// Group Operations
/**
 * 
 * @param {int[]} id_list - An array of group id to be applied
 */
function update_style(style_id,content){
    let new_style = document.createElement("style");
    new_style.id=style_id;
    new_style.appendChild(content)
    let old_style = document.querySelector("#"+style_id);
    if(old_style!=null) old_style.replaceWith(new_style); else document.head.appendChild(new_style);
}
export function apply_groups(id_list){
    let frag = document.createDocumentFragment();
    for (let index = 1; index < id_list.length; index++) {
        const curr = group_list[id_list[index]];
        let css_text = document.createTextNode('.'+curr.name+' .task_name{background-color:'+curr.color+'}');
        frag.appendChild(css_text);
    }
    frag.appendChild(document.createTextNode('.'+group_list[id_list[0]].name+' .task_name{background-color:'+group_list[id_list[0]].color+'}'))
    update_style("style-groups",frag);
}

// Group filters
export function get_filter(g){
    let element_str =                        
        '<li class="flex row justify-fs align-items-ctr">'+
            '<input id="'+g.name+'" class="filter" for="field" type="checkbox">'+
            '<p class="titlecase">'+g.name+'</p>'+
        '</li>';
    return Operations.parseDOM(element_str);
}
export function get_filter_list(id_list){
    let res = [];
    let g_list = []
    id_list.forEach(id => {
        g_list.push(group_list[id]);
    });
    g_list.slice(0,1).concat(g_list.slice(1).sort(function(a,b){
        if(a.name<b.name) return -1;
        if(a.name>b.name) return 1;
        return 0;
    })).forEach(g => {
        res.push(get_filter(g));
    });
    return res;
}
export function apply_filters(filter_names){
    console.log(filter_names);
    let frag = document.createDocumentFragment();

    let f_str = ".task";
    let show_comp = false;
    filter_names.forEach(f => {
        f_str+=":not(."+f+")";
        if(f=="completed") show_comp=true;
    });
    f_str += "{display:none !important}";
    if(!show_comp) f_str+='.completed{display:none !important}';

    let css_text = document.createTextNode(f_str);
    frag.appendChild(css_text);
    update_style("style-task_filter",frag);
}

// Task Object
function Task(std_date, name, description, group_id){
    this.id = Operations.hash(std_date+name+description+group_id);
    this.std_date = std_date;
    this.name = name;
    this.description = description;
    this.group_id = group_id;
}

export async function random_task(){
    let date = Std_date.random_date_from(new Date(),10);
    let year = date.getFullYear().toString();
    let month = (date.getMonth()+1).toString().padStart(2,"0");
    let date_day = date.getDate().toString().padStart(2,"0");
    let time = (Random.random_int(0,23)).toString().padStart(2,"0")+":"+(Random.random_int(0,59)).toString().padStart(2,"0");
    let random_date = year +"-"+ month +"-"+ date_day + "T" + time;
    let group_id = Random.random_int(1,4);
    let name = await Random.lorem_ipsum(Random.random_int(1,5),"words",0);
    let description = await Random.lorem_ipsum(Random.random_int(1,10),"sentences");
    if(group_list.length<=group_id || group_list[group_id]==null){
        let group = new Group(group_id,"group"+group_id,Random.choose_from(["var(--myGreen1)","var(--myYellow1)","var(--myRed1)","var(--myBlue1)"]));
        group.register();
    }
    
    return new Task(random_date, name, description, group_id);
}

export async function random_task_list(num){
    let promise_result;
    let res = {"tasks":[]};

    promise_result = new Promise((resolve,reject)=>{
        for (let index = 0; index < num; index++) {
            random_task()
            .then(response=>{
                res.tasks.push(response);
                if(index>=num-1){
                    resolve();
                }
            }).catch(err=>{
                console.error(err);
                reject();
            })
        }
    })

    await promise_result;
    return res;
}

// Task Element
export function create_task(task){
    let id = task.id;
    let std_date = task.std_date;
    let name = task.name;
    let description = task.description;
    let time = Std_date.convert_date(new Date(std_date)).hh_mm;
    let group_id = task.group_id;
    let res =
            '<li id='+id+' class="task '+group_list[group_id].name+'">'+
                '<div class="task_name flex column justify-ctr align-items-fs"><p>'+name+'</p></div>'+
                '<p class="task_description flex column justify-ctr align-items-fs list-only">'+description+'</p>'+
                '<time datetime="'+std_date+'" class="list-only">'+time+'</time>'+
                '<div class="button_list flex column justify-fe align-items-ctr list-only">'+
                    '<button class="show_attachments iconfont" title="Attachment">&#xe652;</button>'+
                    '<button class="edit iconfont" title="Edit">&#xe641;</button>'+
                    '<button class="complete_task iconfont" title="Complete/Incomplete" onclick="toggle_class(this.parentNode.parentNode,\'completed\',\'\')">&#xe631;</button>'+
                '</div>'+
            '</li>';
    return Operations.parseDOM(res);
}

export function creat_task_list(object){
    let res = [];
    object.tasks.forEach(data => {
        let task = create_task(data);
        res.push(task);
    });
    return res;
}

// Day/week element
export function create_day(date){
    let element = '<div class="task_day">'+
                    '<time datetime="'+Std_date.convert_date(date).YYYY_MM_DD+'"></time>'+
                    '<div class="day">'+
                        '<h1 class="date-month list-only">'+Std_date.convert_date(date).month_name+'</h1>'+
                        '<h1 class="date-day">'+Std_date.convert_date(date).DD+'</h1>'+
                        '<h3 class="week-day">'+Std_date.convert_date(date).day_name+'</h3>'+
                    '</div>'+
                    '<ul class="task_list flex column nowrap justify-fs group'+Random.random_int(1,3)+'"></ul>'+
                '</div>';
    return Operations.parseDOM(element);
}

export function fill_week(from_day,dates=[]){
    let week = [];
    for (let i = 0; i < 7; i++) {
        let curr_date = Std_date.plus_day(from_day,i);
        if(dates.includes(Std_date.convert_date(curr_date).YYYY_MM_DD)){
            continue;
        }
        dates.push(Std_date.convert_date(curr_date).YYYY_MM_DD);

        let curr_day = create_day(curr_date);
        curr_day.classList.add("active");
        if(Std_date.convert_date(curr_date).YYYY_MM_DD==Std_date.convert_date(new Date()).YYYY_MM_DD) curr_day.querySelector(".day").classList.add("active");
        week.push(curr_day);
    }

    return {"week":week,"dates":dates};
}