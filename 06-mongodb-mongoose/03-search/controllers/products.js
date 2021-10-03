const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;

  if (!query) {
    return ctx.throw(400, 'No query specified');
  }

  let products = await Product.find({$text: {$search: query}});

  products = products.map(({_doc: {_id, __v, ...rest}}) => ({
    id: _id,
    ...rest,
  }));

  ctx.body = {products};
};
