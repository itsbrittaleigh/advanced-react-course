const { forwardTo } = require('prisma-binding');

const Query = {
  // forwarding straight from Prisma to DB
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // or you can use the full syntax if you need to do more than just return or send data, like check authentication
  // async items(parent, args, context, info) {
    // const items = await context.db.query.items();
    // return items;
  // }
  me(parent, args, context, info) {
    if(!context.request.userId) return null;
    return context.db.query.user({
      where: { id: context.request.userId },
    }, info);
  },
};

module.exports = Query;
