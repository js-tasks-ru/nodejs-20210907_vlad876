const Session = require('../models/Session');
const {v4: uuid} = require('uuid');

module.exports = (ctx, next) => {
  ctx.login = async (user) => {
    const token = uuid();

    await Session.create({lastVisit: new Date(), user: user._id, token});

    return token;
  };

  return next();
};
