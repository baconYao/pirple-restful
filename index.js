const http = require("http");
const https = require("https");
const url = require("url");
const { StringDecoder } = require('string_decoder');
const fs = require('fs');

const config = require('./lib/config');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Instaniate the HTTP server
const httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

// Start HTTP server
httpServer.listen(config.httpPort, function() {
  console.log("The HTTP server is listening on port " + config.httpPort + " in " + config.envName);
});

// Instaniate the HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pe')
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);
});

// Start HTTPS server
httpsServer.listen(config.httpsPort, function() {
  console.log("The HTTPS server is listening on port " + config.httpsPort + " in " + config.envName);
});

// All the server logic for both the http and https server
var unifiedServer = function(req, res) {
  
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
      "payload": helpers.parseJsonToObject(buffer)
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
      res.setHeader('Content-Type', 'application/json');
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
}

// Define a request router
var router = {
  'ping': handlers.ping,
  'users': handlers.users,
};