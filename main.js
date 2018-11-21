const server = require('http').createServer;
const fs = require('fs');

server(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (fs.existsSync(`web${req.url}`))
        fs.createReadStream(`web${req.url}`).pipe(res);
    else
        fs.createReadStream(`web/index.html`).pipe(res);
}).listen(80);