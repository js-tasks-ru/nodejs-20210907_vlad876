const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
  encoding: 'utf-8',
  highWaterMark: 20,
});

function onData(line) {
  console.log(line);
}

lines.on('data', onData);

// lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка${os.EOL}четвертая строка`);

lines.write('a');
lines.write(`b${os.EOL}c`);
lines.write(`d${os.EOL}e`);
lines.write('f');

lines.end();
