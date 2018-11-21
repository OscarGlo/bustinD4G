const http = require("http");

http.createServer((req, res) => {
	res.writeFile("web/index.html");
});