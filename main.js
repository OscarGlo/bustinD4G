const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
	res.writeHead(200, {"Content-Type": "text/html"});
	fs.createReadStream("web/index.html").pipe(res);
}).listen(80);