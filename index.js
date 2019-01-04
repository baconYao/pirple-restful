const http = require("http");
const url = require("url");

// The server should response to all requests with a string
const server = http.createServer(function(req, res) {
  
  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);
  
  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Send response
  res.end("Hello World\n");

  // Log the request path
  console.log('Request received on path: ' + trimmedPath + ", Request method: " + method);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("The server is listenining on port 3000");
});