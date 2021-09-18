const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();
const ONE_MB = Math.pow(2, 20);

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'POST':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end(`Nested folders are not supported`);
      } else {
        const filepath = path.join(__dirname, 'files', pathname);

        const writableStream = fs.createWriteStream(filepath, {flags: 'wx'});
        const limitSizeStream = new LimitSizeStream({limit: ONE_MB});

        req.pipe(limitSizeStream).pipe(writableStream);

        writableStream
            .on('error', (err) => {
              if (err.code === 'EEXIST') {
                res.statusCode = 409;
                res.end('File already exists');
              } else {
                res.statusCode = 500;
                res.end('Something went wrong');
              }
            });

        writableStream.on('finish', () => {
          res.statusCode = 201;
          res.end('File saved');
        });

        limitSizeStream
            .on('error', (err) => {
              if (err.code === 'LIMIT_EXCEEDED') {
                res.statusCode = 413;
                res.end('File is too big');
              } else {
                res.statusCode = 500;
                res.end('Something went wrong');
              }
              fs.unlink(filepath, (err) => {
                if (err) console.log(err);
              });
            });

        req.on('aborted', () => {
          limitSizeStream.destroy();
          writableStream.destroy();
          fs.unlink(filepath, (err) => {
            if (err) console.log(err);
          });
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
