const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.currentByteLength = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.currentByteLength + chunk.length > this.limit) {
      callback(new LimitExceededError());
    }

    this.currentByteLength += chunk.length;
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
