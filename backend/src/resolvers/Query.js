const { forwardTo } = require('prisma-binding');

const Query = {
  // forwarding straight from Prisma to DB
  items: forwardTo('db'),
  
  // or you can use the full syntax if you need to do more than just return or send data, like check authentication
  // async items(parent, args, context, info) {
    // const items = await context.db.query.items();
    // return items;
  // }
};

module.exports = Query;
