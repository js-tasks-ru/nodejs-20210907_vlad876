const Session = require('../models/Session');

module.exports = async (ctx, next) => {
  const authorization = ctx.request.get('Authorization');

  if (authorization) {
    const token = authorization.split(' ')[1];

    if (token) {
      await Session.findOneAndUpdate({token}, {lastVisit: new Date()});
    }
  }

  return next();
};
