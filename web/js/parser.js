let chars = "0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

speCharsBin = {"_": "01", "x": "10"};
speChars = Object.keys(speCharsBin);

function charCode(char) {
    return chars.indexOf(char);
}

function charFrom(code) {
    return chars.charAt(code);
}

function simplifyAnswers(ans) {
    let keys = Object.keys(ans),
        res = "", bin = "", num = 0;
    
    for (let i = 0, len = keys.length; i < len; ++i) {
        let a_str = ans[keys[i]];
        for (let j = 0, len2 = a_str.length; j < len2; ++j) {
            let char = a_str.charAt(j);
            if (speChars.includes(char)) {
                bin += speCharsBin[char];
            } else {
                let nex = a_str.charAt(i);
                if (nex && nex.match(/[0-9]/)) {
                    num = num * 10 + char;
                } else {
                    let oct = num.toString(8);
                    for (let k = 0, len3 = oct.length; k < len3; ++k)
                        bin += "11" + parseInt(oct.charAt(k)).toString(2);
                }
            }
        }
        if (i !== len - 1) bin += "00";
    }
    
    for (let i = 0, len = Math.ceil(bin.length); i < len; ++i) {
        let str = bin.substr(i*6, 6);
        console.log(str);
    }
}

function decodeAnswers(data, str) {

}