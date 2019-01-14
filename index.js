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

    // Choose the handler this request should go to.
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to he handler
    var data = {
      "trimmedPath": trimmedPath,
      "queryStringObject": queryStringObject,
      "method": method,
      "headers": headers,
      "payload": buffer
    }

    // Router the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log
      console.log('Returning this response: ', statusCode, payloadString);

    });

    // Log the request path
    // console.log('Request received on path: ' + trimmedPath + ", Request method: " + method + "\nWith query string parameters: ", queryStringObject);
    // console.log("Headers: ", headers);
    // console.log("Payloads: ", buffer);
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("The server is listenining on port 3000");
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  // callback a http status code, and a payload object
  callback(406, {'name': 'sample handler'});
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
}

// Define a request router
var router = {
  'sample': handlers.sample
};