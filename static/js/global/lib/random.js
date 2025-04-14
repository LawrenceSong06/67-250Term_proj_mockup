var text;
/**
 * 
 * @param {namepath} path - The path of the original lorem_ipsum text. 
 */
export async function get_lorem_ipsum(path){
    const promise_text = new Promise((resolve,reject)=>{
        fetch(path)
        .then(response => response.text())
        .then(data => {
            text=data.split(/\s|\n|\r/);
            resolve();
        })
        .catch(err => {
            console.error(err);
            reject();
        });
    })

    await promise_text;
}

export function random_int(min,max){
    return Math.round(Math.random()*(max-min))+min;
}

/**
 * 
 * @param {object[]} ranges - An array of ranges in format. Example: [{"min":3,"max":5},{"min":2,"max":10}]
 * @returns int
 */
export function random_int_in_ranges(ranges){
    let total = 0;
    let ranges_length = [];
    let candidates = [];
    ranges.forEach(range => {
        let curr_length = range.max-range.min+1;
        ranges_length.push(curr_length);
        total+= curr_length;
        candidates.push(random_int(range.min,range.max));
    });

    let choice = random_int(0,total);
    let start = 0;
    let res = 0;
    for (let index = 0; index < ranges_length.length; index++) {
        const length = ranges_length[index];
        if(start<=choice && choice < start+length){
            break;
        }
        start+=length;
        res = index;
    }
    return candidates[res];
}

/**
 * 
 * @param {array} list - the array of items
 * @returns 
 */
export function choose_from(list){
    return list[random_int(0,list.length-1)];
}

/**
 * Used for generating Lorem_ipsum
 * @param {int} num - The num of units you want
 * @param {string} unit - Could be words/sentences/paragraphs
 * @param {int} start - Start with "Lorem ipsum dolor sit amet?"(1/0)
 */
export async function lorem_ipsum(num,unit,start=1){
    if(text==undefined) throw new Error("Source text is not loaded!");

    let promise_result;

    let initial = (1^start)*random_int(0,text.length);

    let res = '';
    let count = 0;
    if(unit == "words"){
        let i = initial;
        while(count<num && i<4){
            res+=text[i] + " ";
            count++;
            i++;
        }
        while(count<num){
            if(text[i]!=''){
                res+=text[i] + (random_int(0,3)==0?", ":" ");
                count++;
            }
            i=(i+random_int(1,3))%text.length;
        }
        res = res.charAt(0).toUpperCase() + res.slice(1,res.length-1);
        if(res[res.length-1]==',') res=res.slice(0,res.length-1);
    }else if(unit=="sentences"){
        promise_result =  new Promise((resolve,reject) => {
            for (let i = 0; i < num; i++) {
                lorem_ipsum(random_int(2,10),"words",i==0?1:0)
                .then(response => {
                    res += response+". ";
                    if(i==num-1){
                        resolve();
                    }
                })
                .catch(err => {
                    console.error(err);
                    reject();
                })
            }
        })
    }else if(unit=="paragraphs"){
        promise_result =  new Promise((resolve,reject) => {
            for (let i = 0; i < num; i++) {
                lorem_ipsum(random_int(3,15),"sentences")
                .then(response => {
                    res += response+"\n\n";
                    if(i==num-1){
                        resolve();
                    }
                })
                .catch(err => {
                    console.error(err);
                    reject();
                })
            }
        })
    }else{
        throw new Error("Invalid Unit");
    }
    
    await promise_result;
    return res;
}