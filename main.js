const server = require('http').createServer;
const fs = require('fs');

server(function(req, res) {
    if (req.url === "/") req.url = "web/index.html";
    try {
        console.log(req.url);
        if (fs.existsSync(req.url)) {
            console.log("loaded " + req.url);
            fs.createReadStream(req.url).pipe(res);
        } else if (fs.existsSync(`web${req.url}`)) {
            console.log("loaded web" + req.url);
            fs.createReadStream(`web${req.url}`).pipe(res);
        } else {
            console.log("loaded default");
            fs.createReadStream(`json/questions.json`).pipe(res);
        }
    } catch (e) {
        console.log(e);
        fs.createReadStream(`web/index.html`).pipe(res);
    }
}).listen(80);