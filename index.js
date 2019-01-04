const http = require("http");
const url = require("url");

// The server should response to all requests with a string
const server = http.createServer(function(req, res) {
  
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);
  
  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get a query string as an object
  var queryStringObject = parsedUrl.query

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get headers as an object
  var headers = req.headers;

  // Send response
  res.end("Hello World\n");

  // Log the request path
  console.log('Request received on path: ' + trimmedPath + ", Request method: " + method + "\nWith query string parameters: ", queryStringObject);
  console.log("Headers: ", headers);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("The server is listenining on port 3000");
});