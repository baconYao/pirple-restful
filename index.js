const http = require("http");
const url = require("url");
const { StringDecoder } = require('string_decoder');

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

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');     // 建立一個utf-8的decoder
  var buffer = '';
  req.on('data', function(jData) {               // 建立一個listener，監聽req發出的event，此event叫data，並調用callback function
    buffer += decoder.write(jData);              // 將此json data (jData) 經由decoder轉換成utf-8編碼
  });

  req.on('end', function() {                     // 監聽req end event (此event必定每次都會被監聽到)
    buffer += decoder.end();

    // Send response
    res.end("Hello World\n");

    // Log the request path
    console.log('Request received on path: ' + trimmedPath + ", Request method: " + method + "\nWith query string parameters: ", queryStringObject);
    console.log("Headers: ", headers);
    console.log("Payloads: ", buffer);
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("The server is listenining on port 3000");
});