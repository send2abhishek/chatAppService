const app = require("./index");
const http = require("http");
const server = http.createServer(app);
const port = 3001;
server.listen(port, () => {
  console.log("server is listining at port ", port);
});
