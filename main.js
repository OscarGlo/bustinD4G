const http = require("http");

http.createServer((req, res) => {
	res.writeFile("web/index.html");
	res.end();
}).listen(80);