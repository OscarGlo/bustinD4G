const server = require('http').createServer;
const readStream = require('fs').createReadStream;

server(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    readStream('web/index.html').pipe(res);
}).listen(80);