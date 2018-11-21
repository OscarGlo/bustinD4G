let to, sub_to, qu, sub_qu, sub_sub_qu, answ, prev, next,
    id_to, id_qu, id_sub_qu,
    topics, data;

let nl2br = (str) => str.replace("\n", "<br>");

let elem = (tag) => document.querySelector(tag);

function type(q_data, t) {
    if (q_data.t == null) return (t === "s");
    return q_data.t.includes(t);
}

function loadQuestion() {
    let topic = topics[id_to],
        q_data = data[topic][id_qu],
        pipe = topic.indexOf("|");
    
    to.innerHTML = (pipe !== -1 ? topic.substr(0, pipe) : topic);
    sub_to.innerHTML = (pipe !== -1 ? topic.substr(pipe + 1) : "");
    
    if (!type(q_data, "p")) {
        qu.innerHTML = q_data.n;
        sub_qu.innerHTML = (q_data.s != null ? q_data.s : "");
        
        if (type(q_data, "g")) {
            q_data = q_data.q[id_sub_qu];
            sub_sub_qu.innerHTML = q_data.n;
        } else
            sub_sub_qu.innerHTML = "";
        
        // Generate input
        if (type(q_data, "s") || type(q_data, "m")) {
            let ty = (type(q_data, "s") ? "radio" : "checkbox");
            answ.innerHTML = "";
            for (let i = 0, len = data.a.length; i < len; ++i)
                answ.innerHTML += `<input type="${ty}" name="r" id="${i}" value="${name}"><label for="${i}">${name}</label><br>`;
        } else if (type(q_data, "t"))
            answ.innerHTML = `<input type="text">`;
    }
}

window.addEventListener("load", async () => {
    to = elem("#topic h1");
    sub_to = elem("#topic h2");
    qu = elem("body > h2");
    sub_qu = elem("body h4");
    sub_sub_qu = elem("body h3");
    answ = elem("#answers");
    prev = elem("#prev");
    next = elem("#next");
    
    data = await fetch("/json/questions.json").then(res => res.json());
    
    topics = Object.keys(data);
    id_to = 0;
    id_qu = 0;
    id_sub_qu = 0;
    
    loadQuestion();
});