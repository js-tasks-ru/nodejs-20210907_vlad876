const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data += chunk.toString('utf-8');

    if (this.data.includes(os.EOL)) {
      const splittedChunks = this.data.split(os.EOL);

      for (let i = 0; i < splittedChunks.length - 1; i++) {
        this.push(splittedChunks[i]);
      }

      this.data = splittedChunks[splittedChunks.length - 1];
    }

    callback(null);
  }

  _flush(callback) {
    if (this.data) {
      this.push(this.data);
      this.data = null;
    }

    callback(null);
  }
}

module.exports = LineSplitStream;
