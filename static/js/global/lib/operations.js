const INT_MAX = 2147483647;
const INT_MIN = -2147483648;
// Data Structure
/**
 * 
 * @param {string} key - the string you are hashing
 * @param {int} name - start with a alphabet
 */
export function hash(key,name){
    let hash = 0;
    const MODULUS = 1000000007;
    for (let i=0; i<key.length ; i++) {
        const c = key.charAt(i);
        hash = (31 * hash + c.charCodeAt(0)) % MODULUS;
    }
    if(name){
        hash = "id" + hash;
    }
    return hash;
}
export function int_to_char(num){
    return String.fromCharCode(num);
}
export function char_to_int(char){
    return char.charCodeAt();
}
export function parseDOM(str){
    let template = document.createElement("span");
    template.innerHTML = str;
    return template.childNodes[0];
}

// DOM
export function get_ids(element_list){
    let res = [];
    element_list.forEach(element => {
        res.push(element.id);
    });
    return res;
}

export function change_class(element, class1, class2){
    if(class1!=''){
        element.classList.remove(class1);
    }
    if(class2=='') return;
    element.classList.add(class2);
}

export function toggle_class(element, class1, class2){
    if(element.classList.contains(class1)){
       change_class(element,class1,class2);
    }else{
       change_class(element,class2,class1);
    }
}

export function is_active(element){
    return element.classList.contains("active");
}

export function activate(element){
    element.classList.add("active");
}

export function deactivate(element){
    element.classList.remove("active");
}

export function activate_only(element){
    let other = element.parentElement.children;
    for (let index = 0; index < other.length; index++) {
        const e = other[index];
        deactivate(e);
    }
    activate(element);
}

export function toggle_activity(element){
    if(is_active(element)) deactivate(element); else activate(element);
}

export function select_page(){
    let link_list = document.querySelectorAll("nav a");
    link_list.forEach(link => {
        let loc = link.href.split("/");
        let webname = loc[loc.length-1];
        console.log(loc);
        if(window.location.href.includes(webname)){
            activate(link);
        }
    });
}

var load_promises = [];
export async function load_elements(){
    let onloaders = document.querySelectorAll(".onloader");
    onloaders.forEach(element => {
        element.onload();
    });

    for (let index = 0; index < load_promises.length; index++) {
        await load_promises[index];
    }
}
export async function load(element, url){

    await load_promises.push(new Promise((resolve,reject) => {
        fetch(url)
        .then(response => response.text())
        .then(data => {
            element.replaceWith(parseDOM(data));
            resolve();
        })
        .catch(err => {
            console.error("Error fetching element \""+element+"\":" + err);
            reject(err);
        });
    }));
}
