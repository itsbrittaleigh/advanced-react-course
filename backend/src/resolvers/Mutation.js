const mutations = {
  async createItem(parent, args, context, info) {
    // TODO: check if they are logged in
    const item = await context.db.mutation.createItem({
      data: { ...args },
    }, info);

    return item;
  },
  updateItem(parent, args, context, info) {
    const updates = { ...args };
    delete updates.id;
    return context.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id,
      },
    });
  },
};

module.exports = mutations;
