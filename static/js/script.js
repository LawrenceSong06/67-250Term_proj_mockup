import * as Clock from "./global/clock.js";
import * as Operations from "./global/lib/operations.js"

// Private
function select_page(){
    let link_list = document.querySelectorAll("nav a");
    link_list.forEach(link => {
        let loc = link.href.split("/");
        let webname = loc[loc.length-1];
        if(window.location.href.includes(webname)){
            link.classList.add("active");
        }
    });
}

// Public
window.load=Operations.load;
window.toggle_class = Operations.toggle_class;
window.activate_only = Operations.activate_only;
window.toggle_activity = Operations.toggle_activity;
window.activate = Operations.activate;
window.deactivate = Operations.deactivate;

async function init(){
    Operations.load_elements();

    await Operations.load_elements();
    if(!window.location.href.includes("index.html")){
        Clock.start_clock();
        select_page();
    }
}
window.init=init;

