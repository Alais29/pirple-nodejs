/*
 * Primary File for the API
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
// To test this we can run the command: curl localhost:3000
const server = http.createServer((req, res) => {

  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  // This is how strings are handled in nodejs, we don't just grab its value, we need to bind to the data event or end event of a string, or any other event the string has defined to grab the little pieces of information that the string is sending along
  // If there's a payload, the 'data' event will be called
  req.on('data', function (data) {
    // and we'll use the decoder to turn that data into a single string for utf-8
    buffer += decoder.write(data)
  });
  // When the request ends, the 'end' event is called
  req.on('end', function () {
    // We cap of the buffer with what the request ends with 
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined'
      ? router[trimmedPath]
      : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof (payload) == 'object' ? payload : {}

      // Convert the payload to a string (This is the payload that the handler is sending back to the user)
      const payloadString = JSON.stringify(payload)

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the payload
      console.log(`Returning this response:`, statusCode, payloadString);
    })
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});

//Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
  // Callback a http status code, and a payload object
  callback(406, { 'name': 'sample handler' });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
}

// Define a request router
const router = {
  'sample': handlers.sample
}