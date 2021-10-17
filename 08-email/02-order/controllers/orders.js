const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

const formErrorsObject = (error) => Object.keys(error.errors).reduce((acc, key) => {
    acc[key] = error.errors[key].message;
    return acc;
}, {});

module.exports.checkout = async function checkout(ctx, next) {
    const {product, phone, address} = ctx.request.body;
    const user = ctx.user;

    const order = new Order({product, phone, address, user: user._id});

    try {
        await order.validate();
    } catch (error) {
        const errors = formErrorsObject(error);

        ctx.response.status = 400;
        ctx.response.body = {
            errors,
        };
        return;
    }

    await order.save();

    await sendMail({
        to: user.email,
        subject: 'Order Confirmation',
        template: 'order-confirmation',
        locals: {
            product,
            id: order._id,
        },
    });

    ctx.response.body = {
        success: true,
        order: order._id,
    };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const user = ctx.user;

    const orders = await Order.find({user: user._id});

    ctx.response.body = {
        orders, 
    };
};
