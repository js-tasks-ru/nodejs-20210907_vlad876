const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  let products = await Product.find({subcategory});

  products = products.map(({_doc: {_id, __v, ...rest}}) => ({
    id: _id,
    ...rest,
  }));

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  let products = await Product.find({});

  products = products.map(({_doc: {_id, __v, ...rest}}) => ({
    id: _id,
    ...rest,
  }));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const objectId = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(objectId)) {
    ctx.throw(400);
  } else {
    const product = await Product.findById(ctx.params.id);

    if (!product) {
      ctx.throw(404, 'Not found');
    } else {
      const {_doc: {_id, __v, ...rest}} = product;

      ctx.body = {
        product: {
          id: _id,
          ...rest,
        }
      };
    }
  }
};

