const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find({});

  categories = categories.map(({_doc: {_id, __v, ...rest}}) => {
    const category = {
      id: _id,
      title: rest.title,
      subcategories: [],
    };

    category['subcategories'] = rest.subcategories.map(({_id, title}) => ({
      id: _id,
      title,
    }));

    return category;
  });

  ctx.body = {categories};
};
