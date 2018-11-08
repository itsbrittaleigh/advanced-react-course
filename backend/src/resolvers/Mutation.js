const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };
    const item = await context.db.query.item({ where }, `{ id title }`);
    // TODO: check if the user owns that item
    return context.db.mutation.deleteItem({ where }, info);
  },
  async signUp(parent, args, context, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      },
    }, info);
    
    // automatically sign user in using created user and cookies
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 31536000000, // 1 year
    });
    return user;
  },
  async signIn(parent, {email, password}, context, info) {
    const user = await context.db.query.user({ where: { email } });
    if(!user) throw new Error(`No such user found for email ${email}`);
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new Error('Invalid password');
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 31536000000, // 1 year
    });
    return user;
  },
  signOut(parent, args, context, info) {
    context.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
};

module.exports = mutations;
