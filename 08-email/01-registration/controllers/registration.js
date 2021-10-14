const {v4: uuid} = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');
const AuthenticationErrors = require('../enums/AuthenticationErrors');

module.exports.register = async (ctx, next) => {
    const {displayName, email, password} = ctx.request.body;

    const user = await User.findOne({email});

    if (user) {
        ctx.response.status = 400;
        ctx.response.body = {
            errors: {email: AuthenticationErrors.USER_ALREADY_EXISTS},
        };
        return;
    }

    const verificationToken = uuid();

    const u = new User({email, displayName, verificationToken});
    await u.setPassword(password);
    await u.save();

    await sendMail({
        to: email,
        subject: 'Registration confirmation at LearnJavascript',
        template: 'confirmation',
        locals: {
            token: verificationToken,
        },
    });
    
    ctx.response.body = {
        status: 'ok',
    };
};

module.exports.confirm = async (ctx, next) => {
    const {verificationToken} = ctx.request.body;
    
    const user = await User.findOne({verificationToken});

    if (!user) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: AuthenticationErrors.CONFIRMATION_LINK_INVALID,
        };
        return;
    }

    await User.findOneAndUpdate({verificationToken}, {$unset: {verificationToken: ''}});

    const sessionToken = uuid();

    await Session.create({user: user._id, token: sessionToken, lastVisit: new Date()});

    ctx.response.body = {
        status: 'ok',
        token: verificationToken,
    };
};
