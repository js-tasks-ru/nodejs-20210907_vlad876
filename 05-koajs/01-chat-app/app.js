const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
    const subscriberId = ctx.request.query.r || Math.random();

    const promise = new Promise((resolve) => {
        subscribers[subscriberId] = resolve;
    });

    ctx.req.on('close', () => {
        delete subscribers[subscriberId];
    });

    ctx.req.on('aborted', () => {
        delete subscribers[subscriberId];
    });
    
    const message = await promise;

    ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
    const { message } = ctx.request.body;

    if (message) {
        for (const subscriber of Object.values(subscribers)) {
            subscriber(message);
        }
    }

    ctx.body = {
        success: true
    };
});


app.use(router.routes());

module.exports = app;
