function htmlQuestion(id, data) {
    let str = `<div id="q${id}"><h2>${data.name}</h2>`;
    if (data.type === "")
        for (let i = 0, len = data.answers.length; i < len; ++i) {
            let r_id = `r${id}_${i}`, name = data.answers[i];
            str += `<input type="radio" name="r${id}" id="${r_id}" value="${name}"><label for="${r_id}">${name}</label><br>`;
        }
    else
        str += "<input type='text'>";
    return str + "</div>";
}

window.addEventListener("load", async () => {
    let q_data = await fetch("/json/questions.json").then(res => res.json()),
        topics = Object.keys(q_data),
        q_id = 0;
    
    for (let i = 0, len = topics.length; i < len; ++i) {
        let topic = topics[i];
        let t_data = q_data[topic];
    
        document.body.innerHTML += `<h1>${topic}</h1>`;
        
        for (let j = 0, len2 = t_data.length; j < len2; ++j) {
            document.body.innerHTML += htmlQuestion(++q_id, t_data[j]);
        }
    }
});