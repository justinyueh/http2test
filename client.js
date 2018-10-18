const http2 = require('http2');

let client;

function createClient() {
  client = http2.connect('http://localhost:3000');

  client.on('close', () => {
    client = null;
    console.log('=======close========');
  });

  client.on('error', (err) => {
    console.log('=======client error========');
    console.error(err);
  });
}

function start() {
  createClient();

  function request() {
    if (!client || client.closed || client.destroyed) {
      createClient();
    }

    const req = client.request({
      ':path': '/healthcheck',
    });
    req.on('response', function(headers, flags) {
      console.log('headers:', headers);
      console.log('flags:', flags)
    });

    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => {
      console.log(`The server says: ${data}`);
      // client.close();
      console.log(data);
    });
    req.on('error', (error) => {
      console.log('======req error======', error);
    });

    req.end();
  }

  request();

  setInterval(() => {
    request();
  }, 2000);
}

start();
