const server = require('http').createServer;
const fs = require('fs');

server(function(req, res) {
    if (req.url === "/") req.url = "web/index.html";
    try {
        if (fs.existsSync(req.url))
            fs.createReadStream(req.url).pipe(res);
        else if (fs.existsSync(`web${req.url}`))
            fs.createReadStream(`web${req.url}`).pipe(res);
        else
            fs.createReadStream(`web/index.html`).pipe(res);
    } catch (e) {
        console.log(e);
        fs.createReadStream(`web/index.html`).pipe(res);
    }
}).listen(80);