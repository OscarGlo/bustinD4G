const server = require('http').createServer;
const fs = require('fs');

server(function(req, res) {
    if (req.url === "/")
        req.url = "web/index.html";
    if (fs.existsSync(`web${req.url}`))
        fs.createReadStream(`web${req.url}`).pipe(res);
    else
        fs.createReadStream("web/index.html").pipe(res);
}).listen(80);