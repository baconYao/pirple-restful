/*
 * Request handlers
 *
 *
 * 
 */ 

// Define the handlers
var handlers = {};

// Users handler
handlers.users = function(data, callback) {
  var acceptableMethod = ['post', 'get', 'put', 'delete'];
  if(acceptableMethod.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);      // HTTP method noe allowd
  }
}

// Container for the users submethods
handlers._users = {};

// Users - post
handlers._users.post = function(data, callback) {

};

// Users - get
handlers._users.get = function(data, callback) {

};

// Users - put
handlers._users.put = function(data, callback) {

};

// Users - delete
handlers._users.delete = function(data, callback) {

};

// Ping handler
handlers.ping = function(data, callback) {
  // callback a http status code, and a payload object
  callback(200);
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
}

module.exports = handlers;