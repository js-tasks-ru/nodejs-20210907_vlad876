const Session = require('../models/Session');

module.exports = async function mustBeAuthenticated(ctx, next) {
  const authorization = ctx.request.get('Authorization');

  if (authorization) {
    const token = authorization.split(' ')[1];
    const session = await Session.findOne({token}).populate('user');

    if (session) {
      ctx.user = session.user;
      return next();
    } else {
      ctx.throw(401, 'Неверный аутентификационный токен');
      return;
    }
  }

  ctx.throw(401, 'Пользователь не залогинен');
};
