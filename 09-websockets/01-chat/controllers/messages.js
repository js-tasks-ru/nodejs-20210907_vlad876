const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user._id}).limit(20);

  const mappedMessages = messages.map(({date, _id, text, user}) => ({date, id: _id, text, user}));

  ctx.body = {
    messages: mappedMessages,
  };
};
