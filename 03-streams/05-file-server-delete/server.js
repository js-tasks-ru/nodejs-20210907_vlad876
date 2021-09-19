const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'DELETE':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end(`Nested folders are not supported`);
      } else {
        const filepath = path.join(__dirname, 'files', pathname);

        fs.unlink(filepath, (err) => {
          if (err && err.code == 'ENOENT') {
            res.statusCode = 404;
            res.end(`File ${pathname} not found`);
          } else if (err) {
            res.statusCode = 500;
            res.end('Something went wrong');
          } else {
            res.end('File successfully removed');
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
