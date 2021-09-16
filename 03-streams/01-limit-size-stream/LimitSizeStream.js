const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.currentByteLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentByteLength += chunk.byteLength;

    if (this.currentByteLength > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
