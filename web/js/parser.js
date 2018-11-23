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
    let answers = [];

    let count = 0, end = decoded.length;
    let nb_answers;
    let stack = [[0, 0, 0]];

    while (count < end && id_to < topics.length-1){

        nb_answers = data[topics[id_to]].q[id_qu].a.length;

        let strg = "";

        
        for (let i = 0, len = nb_answers; i < len; i++, count++) {
            console.log(decoded.charAt(count));
            if (decoded.charAt(count) === "_") {
                strg += "_";
            } else if (decoded.charAt(count) === "x"){
                strg += "x";
            } else {
                while (decoded.charAt(count) !== ".") {
                    strg += decoded.charAt(count);
                    count++;
                }
            }
        }

        answers[[id_to, id_qu, id_sub_qu]] = strg;
        
        if(strg !== "") stack.push([id_to, id_qu, id_sub_qu]);

        let res = data[topics[id_to]].q[id_qu].a[answers[[id_to, id_qu, id_sub_qu]].indexOf("x")];

        if (typeof res === "object") {
            id_to = res.j[0];
            id_qu = res.j[1];
        } else if(typeof  res === "string"){
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
try {
    module.exports = {decodeAnswers: decodeAnswers, codeAnswers: codeAnswers};
} catch (e) {}