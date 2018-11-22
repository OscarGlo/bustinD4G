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

speCharsBin = {"_": "01", "x": "10"};
speChars = Object.keys(speCharsBin);

let charCode = (char) => chars.indexOf(char);

let charFrom = (code) => chars.charAt(code);

function oct3(num) {
    let str = parseInt(num).toString(2);
    for (let j = str.length; j < 3; ++j)
        str = "0" + str;
    return str;
}

function simplifyAnswers(ans) {
    let keys = Object.keys(ans),
        bin = "", num = 0;
    
    for (let i = 0, len = keys.length; i < len; ++i) {
        let a_str = ans[keys[i]];
        for (let j = 0, len2 = a_str.length; j < len2; ++j) {
            let char = a_str.charAt(j);
            if (speChars.includes(char))
                bin += speCharsBin[char];
            else {
                num = num * 10 + parseInt(char);
                if (!a_str.charAt(j + 1).match(/[0-9]/)) {
                    let oct = num.toString(8);
                    for (let k = 0, len3 = oct.length; k < len3; ++k)
                        bin += "11" + oct3(oct.charAt(k));
                    num = 0;
                }
            }
            
            console.log(char, bin);
        }
        if (i !== len - 1) bin += "00";
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

}

function decoder(str){
    let answers = "";
    for(let i = 0, len = str.length; i < len; i++){
        if(str.charAt(i) === "0"){
            answers += "_";
        }else if(str.charAt(i) === "1"){
            if(str.charAt(i + 1) === "0"){
                answers += "X";
            }else{
                i++;
                do{

                    let tmp = "";
                    for(let j = 0; j < 3; ++j){
                        i++;
                        tmp += str.charAt(i);
                    }
                    console.log(tmp);
                    answers += parseInt(tmp, 2);
                    i=i+2;
                }while(str.charAt(i-1) === "1" && str.charAt(i) === "1")
            }
        }
    }
    return answers;
}