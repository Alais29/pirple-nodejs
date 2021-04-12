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

    // Send the response
    res.end('Hello World\n');

    // Log the payload
    console.log(`Request received with this payload: `, buffer);
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});