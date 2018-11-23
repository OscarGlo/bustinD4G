let to_div, to, sub_to, qu, sub_qu, sub_sub_qu, answ, prev, next, copy_url, results,
    id_to = 0, id_qu = 0, id_sub_qu = 0,
    topics, data, qu_stack = [], ans_table = {}, curry_stack = [];

let nl2br = (str) => str.replace("\n", "<br>");

let type = (q_data, t) => (q_data.t == null && t === "s") || q_data.t === t;

async function send() {
    await fetch("/", {
        method: "post",
        body: codeAnswers(ans_table)
    });
}

function ids_next(data, id_to, id_qu, id_sub_qu) {
    let topics = Object.keys(data);
    
    if (data[topics[id_to]].q) {
        if (data[topics[id_to]].q[id_qu].t === "g") {
            id_sub_qu++;
            if (data[topics[id_to]].q[id_qu].q[id_sub_qu] == null) {
                id_sub_qu = 0;
                id_qu++;
            }
        } else
            id_qu++;
        
        if (data[topics[id_to]].q[id_qu] == null) {
            id_qu = 0;
            id_to++;
        }
    } else
        id_to++;
    
    return [id_to, id_qu, id_sub_qu];
}

let chars = "0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

speCharsBin = {"_": "0", "x": "10"};
speChars = Object.keys(speCharsBin);

let charCode = (char) => chars.indexOf(char);

let charFrom = (code) => chars.charAt(code);

function oct3(num) {
    let str = parseInt(num).toString(2);
    for (let j = str.length; j < 3; ++j)
        str = "0" + str;
    return str;
}

function codeAnswers(ans) {
    let keys = Object.keys(ans),
        bin = "", num = 0;
    
    for (let i = 0, len = keys.length; i < len; ++i) {
        let a_str = ans[keys[i]];
        for (let j = 0, len2 = a_str.length; j < len2; ++j) {
            let char = a_str.charAt(j);
            if (speChars.includes(char))
                bin += speCharsBin[char];
            else if (char.match(/[0-9]/)) {
                num = num * 10 + parseInt(char);
                if (!a_str.charAt(j + 1).match(/[0-9]/)) {
                    let oct = num.toString(8);
                    for (let k = 0, len3 = oct.length; k < len3; ++k)
                        bin += "110" + oct3(oct.charAt(k));
                    bin += "111";
                    num = 0;
                }
            }
        }
    }
    
    let res = "";
    
    for (let i = 0, len = Math.ceil(bin.length/6); i < len; ++i) {
        let str = bin.substr(i*6, 6);
        for (let j = str.length; j < 6; ++j)
            str += "0";
        res += charFrom(parseInt(str, 2));
    }
    
    return res;
}

function decodeAnswers(data, str) {
    let decoded = decoder(str);
    let topics = Object.keys(data);
    let id_to = 1, id_qu = 0, id_sub_qu = 0;
    let answers = {};
    
    let count = 0, end = decoded.length;
    let nb_answers;
    let stack = [[0, 0, 0]];
    
    while (count < end && id_to < topics.length-1) {
        nb_answers = data[topics[id_to]].q[id_qu].a.length;
        
        let strg = "";
        
        for (let i = 0, len = nb_answers; i < len; i++, count++) {
            if (decoded.charAt(count) === "_") {
                strg += "_";
            } else if (decoded.charAt(count) === "x"){
                strg += "x";
            } else if(decoded.charAt(count).match(/([0-9]|\.)/)){
                while (decoded.charAt(count) !== "." && decoded.charAt(count) !== "") {
                    strg += decoded.charAt(count);
                    count++;
                }
                strg += ".";
            }else{
                strg = "";
            }
        }
        
        if(strg.match(/^_*$/)) break;
        
        answers[[id_to, id_qu, id_sub_qu]] = strg;
        
        if(strg !== "") stack.push([id_to, id_qu, id_sub_qu]);
        
        let res = data[topics[id_to]].q[id_qu].a[answers[[id_to, id_qu, id_sub_qu]].indexOf("x")];
        
        if (typeof res === "object") {
            id_to = res.j[0];
            id_qu = res.j[1];
        } else {
            [id_to, id_qu, id_sub_qu] = ids_next(data, id_to, id_qu, id_sub_qu);
        }
    }
    return [stack, answers];
}


function decoder(code) {
    let str = "";
    for (let i = 0, len = code.length; i < len; i++) {
        let tmp = charCode(code.charAt(i)).toString(2);
        for(let j = tmp.length; j < 6; j++){
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    
    let answers = "";
    for(let i = 0, len = str.length; i < len; ) {
        if (str.charAt(i) === "0") {
            answers += "_";
            i++;
        } else if (str.charAt(i) === "1") {
            i++;
            if (str.charAt(i) === "0") {
                answers += "x";
                i++;
            } else {
                i++;
                if (str.charAt(i) === "0") {
                    i++;
                    let octal = "";
                    let endNb = "";
                    do {
                        let tmp = str.substr(i, 3);
                        octal += parseInt(tmp, 2).toString();
                        
                        tmp = str.substr(i + 3, 3);
                        endNb = tmp;
                        i += 6;
                    } while (endNb !== "111");
                    answers += parseInt(octal, 8);
                    answers += ".";
                }
            }
        }
    }
    return answers;
}

function loadQuestion() {
    let topic = topics[id_to],
        pipe = topic.indexOf("|");
    
    to.innerHTML = (pipe !== -1 ? topic.substr(0, pipe) : topic);
    sub_to.innerHTML = (pipe !== -1 ? topic.substr(pipe + 1) : "");
    
    let c = data[topic].c;
    if (!c) c = [255, 255, 255];
    to_div.style.backgroundColor = `rgb(${c.join(",")})`;
    
    if (data[topic].q) {
        let q_data = data[topic].q[id_qu];
    
        qu.innerHTML = q_data.n;
        sub_qu.innerHTML = (q_data.s != null ? nl2br(q_data.s) : "");
        
        let ans = q_data.a;
    
        if (type(q_data, "g")) {
            q_data = q_data.q[id_sub_qu];
            sub_sub_qu.innerHTML = q_data;
        } else
            sub_sub_qu.innerHTML = "";
    
        // Generate input
        if (type(q_data, "s") || type(q_data, "m")) {
            let ty = (type(q_data, "s") ? "radio" : "checkbox");
            let spanT = (ty === "radio" ? "checkmark" : "checkblock");
            answ.innerHTML = "";
            for (let i = 0, len = ans.length; i < len; ++i) {
                let name = (typeof ans[i] === "object" ? ans[i].n : ans[i]),
                    nameText = name.replace("_", "<input type='number'>");
                answ.innerHTML += `<label class="container"><input type="${ty}" name="r">${nameText}`
                    + `<span class="${spanT}"></span></label>`;
            }
        } else if (type(q_data, "t"))
            answ.innerHTML = `<input type="number">`;
        
        let saved = ans_table[[id_to, id_qu, id_sub_qu]];
        if (saved) {
            let num = 0, off = 0;
            if (saved.includes("_") || saved.includes("x")) {
                for (let i = 0, len = saved.length; i < len; ++i) {
                    let val = saved.charAt(i);
                    if (val !== "_") {
                        answ.childNodes[i + off].childNodes[0].checked = true;
                        if (val !== "x" && val !== ".") {
                            let nex = saved.charAt(i+1);
                            num = num * 10 + parseInt(nex);
                            off--;
                            
                            if (!nex || !nex.match(/[0-9]/)){
                                console.log(answ);
                                answ.childNodes[i + off].childNodes[1].value = num;
                            }
                            
                        }
                    }
                }
            } else
                answ.childNodes[0].value = saved;
        }
    } else {
        qu.innerHTML = sub_sub_qu.innerHTML = answ.innerHTML = "";
        sub_qu.innerHTML = data[topic].n;
    }
}

function getAnswer() {
    let nodes = answ.childNodes,
        ans = "";
    for (let i = 0, len = nodes.length; i < len; ++i) {
        let node = nodes[i];
        if (node.tagName === "LABEL")
            ans += (node.childNodes[0].checked ? (node.childNodes[1].tagName === "INPUT" ? node.childNodes[1].value : "x") : "_");
        else if (node.tagName === "INPUT")
            ans += node.value + ".";
    }
    return ans;
}

function save_ans(ans) {
    ans_table[[id_to, id_qu, id_sub_qu]] = (ans == null ? getAnswer() : ans);
}

function next_qu() {
    let ans = getAnswer();
    if ((!ans.match(/^_*$/) || id_to === 0) && !next.classList.contains("dis")) {
        save_ans(ans);

        qu_stack.push([id_to, id_qu, id_sub_qu]);


        let jump = null;
        if (data[topics[id_to]].q && data[topics[id_to]].q[id_qu].a) {
            jump = data[topics[id_to]].q[id_qu].a[ans.indexOf("x")];
            if (jump) jump = jump.j;
        }

        if (jump)
            [id_to, id_qu] = jump;
        else
            [id_to, id_qu, id_sub_qu] = ids_next(data, id_to, id_qu, id_sub_qu);
        
        prev.classList.remove("dis");
        if (id_to === topics.length - 1)
            next.innerHTML = "Submit";

        loadQuestion();

        let tmp = curry_stack.pop();
        let same = false;
            while(tmp !== undefined && !same){
                if(tmp[0] !== id_to || tmp[1] !== id_qu || tmp[2] !== id_sub_qu){
                    delete ans_table[tmp];
                    tmp = curry_stack.pop();
                } else {
                    same = true;

                }
            }


    }
}

function prev_qu() {
    if (!prev.classList.contains("dis")) {
        save_ans();

        curry_stack.push([id_to, id_qu, id_sub_qu]);
        [id_to, id_qu, id_sub_qu] = qu_stack.pop();

        
        if (next.innerHTML === "Submit")
            next.innerHTML = "&gt;&gt;";
        next.classList.remove("dis");
        if (qu_stack.length === 0)
            prev.classList.add("dis");
        
        loadQuestion();
    }
}

window.addEventListener("load", async () => {
    let e = (s) => document.querySelector(s);
    to_div = e("body > div:first-child");
    to = e("h1");
    sub_to = e("body > div:first-child > h2");
    qu = e("body > div:last-child > h2");
    sub_qu = e("body > div:last-child > h4");
    sub_sub_qu = e("body > div:last-child > h3");
    answ = e("body > div:last-child > div > div");
    prev = e("body > div:last-child > button:first-of-type");
    next = e("body > div:last-child > button:last-of-type");
    copy_url = e("body > div:first-child > button:first-of-type");
    results = e("body > div:first-child > button:last-of-type");
    
    let body = document.getElementsByTagName('body')[0];
    
    data = await fetch("/json/q.json").then(res => res.json());
    
    topics = Object.keys(data);
    
    let url = window.location.href,
        sub = url.substr(url.lastIndexOf("/") + 1);
    if (sub !== "") {
        let decode = decodeAnswers(data, sub),
            keys = Object.keys(decode[1]);
        ans_table = decode[1];
        [id_to, id_qu, id_sub_qu] = keys[keys.length - 1].split(",");
        
        qu_stack = decode[0];
    }
    
    prev.addEventListener("click", prev_qu);
    next.addEventListener("click", async () => {
        if (next.innerHTML === "Submit") {
            await send();
            body.innerHTML = "The form was sent.<br><a href='/'>Reload the page</a>";
        } else next_qu();
    });
    copy_url.addEventListener("click", () => {
        const el = document.createElement('textarea');
        el.value = "http://vps613152.ovh.net/" + codeAnswers(ans_table);
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    });
    results.addEventListener("click", async () => {
        let res = await fetch("/results").then(res => res.text()).then(txt => txt.split("\n"));
        body.innerHTML = "";
        let allAns = {};
        for (let i = 0, len = res.length; i < len; ++i) {
            let ans = decodeAnswers(data, res[i])[1],
                keys = Object.keys(ans);
            for (let j = 0, len2 = ans.length; j < len2; ++j) {
                if (!allAns[keys[j]])
                    allAns[keys[j]] = [];
                if (!allAns[keys[j]][ans[keys[j]].indexOf("x")]) {
                    allAns[keys[j]][ans[keys[j]].indexOf("x")] = 1;
                } else {
                    allAns[keys[j]][ans[keys[j]].indexOf("x")] = +1;
                }
            }
        }
    
        for (let i = 0, len = allAns.length; i < len; ++i) {
            body.innerHTML += JSON.stringify(allAns[i]);
        }
    });
    
    loadQuestion();
});