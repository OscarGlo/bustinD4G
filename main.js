const server = require('http').createServer;
const fs = require('fs');
const {code, decode} = require('/web/js/parser');

server(function(req, res) {
    if (req.method === "GET") {
        if (req.url === "/")
            req.url = "web/index.html";
        if (fs.existsSync(`web${req.url}`))
            fs.createReadStream(`web${req.url}`).pipe(res);
        else
            fs.createReadStream("web/index.html").pipe(res);
    } else if (req.method === "POST") {
        req.on("data", data => {
            console.log(data.toString());
        })
    }
}).listen(80);