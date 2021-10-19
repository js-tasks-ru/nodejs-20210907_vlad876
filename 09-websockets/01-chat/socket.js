const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const options = {
    allowEIO3: true,
  };

  const io = socketIO(server, options);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token}).populate('user');
    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session.user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const user = socket.user;
      await Message.create({date: new Date(), text: msg, chat: user._id, user: user.displayName});
    });
  });

  return io;
}

module.exports = socket;
