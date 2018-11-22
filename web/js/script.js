let to_div, to, sub_to, qu, sub_qu, sub_sub_qu, answ, prev, next,
    id_to = 0, id_qu = 0, id_sub_qu = 0,
    topics, data, qu_stack = [], ans_table = {};

let nl2br = (str) => str.replace("\n", "<br>");

let elem = (tag) => document.querySelector(tag);

function type(q_data, t) {
    if (q_data.t == null) return (t === "s");
    return q_data.t.includes(t);
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
            answ.innerHTML = `<input type="text">`;
        
        let saved = ans_table[[id_to, id_qu, id_sub_qu]];
        if (saved) {
            let num = 0;
            if (saved.includes("_") || saved.includes("x")) {
                for (let i = 0, len = saved.length; i < len; ++i) {
                    let val = saved.charAt(i);
                    if (val !== "_") {
                        answ.childNodes[i].childNodes[0].checked = true;
                        if (val !== "x") {
                            let nex = saved.charAt(i+1);
                            if (nex && nex.match(/[0-9]/))
                                num = num * 10 + parseInt(nex);
                            else
                                answ.childNodes[i].childNodes[1].value = num;
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
            ans += node.value;
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
        
        if (jump) {
            [id_to, id_qu] = jump;
        } else {
            [id_to, id_qu, id_sub_qu] = ids_next(data, id_to, id_qu, id_sub_qu);
    
            prev.classList.remove("dis");
            if (id_to === topics.length - 1)
                next.classList.add("dis");
        }
    
        loadQuestion();
    }
}

function prev_qu() {
    if (!prev.classList.contains("dis")) {
        save_ans();
        
        [id_to, id_qu, id_sub_qu] = qu_stack.pop();
        
        next.classList.remove("dis");
        if (qu_stack.length === 0)
            prev.classList.add("dis");
        
        loadQuestion();
    }
}

window.addEventListener("load", async () => {
    to_div = elem("#topic");
    to = elem("#topic h1");
    sub_to = elem("#topic h2");
    qu = elem("#bottom h2");
    sub_qu = elem("#bottom h4");
    sub_sub_qu = elem("#bottom h3");
    answ = elem("#answers > div");
    prev = elem("#prev");
    next = elem("#next");
    
    data = await fetch("/json/q.json").then(res => res.json());
    
    topics = Object.keys(data);
    
    prev.addEventListener("click", prev_qu);
    next.addEventListener("click", next_qu);
    
    loadQuestion();
});