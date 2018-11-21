const http = require("http");
const fs = require("fs");

http.createServer(async (req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream('index.html').pipe(res);
}).listen(80);