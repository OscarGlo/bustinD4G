const server = require('http').createServer;
const fs = require('fs');
//const parser = require('./web/js/parser.js');

server(function(req, res) {
    if (req.method === "GET") {
        if (req.url === "/")
            req.url = "web/index.html";
        if (req.url === "/results")
            fs.createReadStream("results.txt").pipe(res);
        else if (fs.existsSync(`web${req.url}`))
            fs.createReadStream(`web${req.url}`).pipe(res);
        else
            fs.createReadStream("web/index.html").pipe(res);
    } else if (req.method === "POST") {
        req.on("data", data => {
            fs.appendFileSync("results.txt", data.toString() + "\n");
        });
    }
}).listen(80);