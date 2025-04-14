import * as Clock from "./global/clock.js";
import * as Operations from "./global/lib/operations.js"
var promises=[];

// Private
function load_elements(){
    let onloaders = document.querySelectorAll(".onloader");
    onloaders.forEach(element => {
        element.onload();
    });
}

// Public
function load(element, url){
    promises.push(new Promise((resolve,reject) => {
        fetch(url)
        .then(response => response.text())
        .then(data => {
            element.replaceWith(Operations.parseDOM(data));
            resolve();
        })
        .catch(err => {
            console.error("Error fetching element \""+element+"\":" + err);
            reject(err);
        });
    }))
}
async function init(){
    load_elements();
    for (let index = 0; index < promises.length; index++) {
        const promise = promises[index];
        await promise;
    }
    if(!window.location.href.includes("index.html")) Clock.start_clock();
}

window.load=load;
window.init=init;