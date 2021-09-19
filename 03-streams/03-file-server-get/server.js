const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'GET':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end(`Nested folders are not supported`);
      } else {
        const filepath = path.join(__dirname, 'files', pathname);
        const stream = fs.createReadStream(filepath);

        stream.pipe(res);

        stream.on('error', (err) => {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end(`File ${pathname} not found`);
          } else {
            res.statusCode = 500;
            res.end('Something went wrong');
          }
        });

        req.on('aborted', () => {
          stream.destroy();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
