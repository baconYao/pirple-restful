/*
 * Request handlers
 *
 *
 * 
 */ 

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

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
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 12 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement) {
    // Make sure that the user doesn't already exist
    _data.read('users', phone, function(err, data) {
      if(err) {
        // Hash the password
        var hashpassword = helpers.hash(password);

        // Create the user object
        if(hashpassword) {
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashpassword': hashpassword,
            'tosAgreement': true,
          }
  
          // Store the user
          _data.create('users', phone, userObject, function(err) {
            if(!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {'Error': "Could not create the new user"});
            }
          });
        } else {
          callback(500, {'Error': "Could not hash the user\'s password"});
        }
      } else {
        // User already exists
        callback(400, {'Error': 'A user with that phone number already exists'})
      }
    });
  } else {
    callback(400, {'Error': "Missing required fields"})
  }
};

// Users - get
// Required data: phone
// Optional data: none
// @TODO only let an authenticated user access their objrct. Don't let them access anyone else.
handlers._users.get = function(data, callback) {
  // Check the phone number is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 12 ? data.queryStringObject.phone.trim() : false;
  if(phone) {
    // lookup the user
    _data.read('users', phone, function(err, data) {
      if(!err && data) {
        // Remove the hashed password from the user object before returing it to the requester
        delete data.hashpassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user update their own object. Don't let them update anyone else.
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