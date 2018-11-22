let to_div, to, sub_to, qu, sub_qu, sub_sub_qu, answ, prev, next,
    id_to = 0, id_qu = 0, id_sub_qu = 0,
    topics, data, qu_stack = [];

let nl2br = (str) => str.replace("\n", "<br>");

let elem = (tag) => document.querySelector(tag);

function type(q_data, t) {
    if (q_data.t == null) return (t === "s");
    return q_data.t.includes(t);
}

function getAnswer() {
    let nodes = answ.childNodes,
        ans = [];
    for (let i = 0, len = nodes.length; i < len; ++i) {
        let node = nodes[i];
        if (node.tagName === "LABEL") {
            if (node.childNodes[0].checked)
                ans.push(node.childNodes[1].data);
        } else if (node.tagName === "INPUT")
            ans.push(node.value);
    }
    return ans.join("|");
}

function loadQuestion() {
    console.log(id_to, id_qu, id_sub_qu);
    
    let topic = topics[id_to],
        pipe = topic.indexOf("|");
    
    to.innerHTML = (pipe !== -1 ? topic.substr(0, pipe) : topic);
    sub_to.innerHTML = (pipe !== -1 ? topic.substr(pipe + 1) : "");
    
    let c = data[topic].c;
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
            answ.innerHTML = "";
            for (let i = 0, len = ans.length; i < len; ++i) {
                let name = ans[i],
                    nameText = name.replace("_", "<input type='text'>");
                answ.innerHTML += `<label class="container"><input type="${ty}" name="r">${nameText}`
                    + `<span class="checkmark"></span></label>`;
            }
        } else if (type(q_data, "t"))
            answ.innerHTML = `<input type="text">`;
    } else {
        qu.innerHTML = sub_sub_qu.innerHTML = answ.innerHTML = "";
        sub_qu.innerHTML = data[topic].n;
    }
}

function next_qu() {
    if (!next.classList.contains("dis")) {
        qu_stack.push([id_to, id_qu, id_sub_qu]);
    
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
    
        prev.classList.remove("dis");
        if (id_to === topics.length - 1)
            next.classList.add("dis");
    
        loadQuestion();
    }
}

function prev_qu() {
    if (!prev.classList.contains("dis")) {
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
    
    data = await fetch("/json/questions.json").then(res => res.json());
    
    topics = Object.keys(data);
    
    prev.addEventListener("click", prev_qu);
    next.addEventListener("click", next_qu);
    
    loadQuestion();
});