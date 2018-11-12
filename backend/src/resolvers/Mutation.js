const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');

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
  async requestReset(parent, args, context, info) {
    const user = await context.db.query.user({ where: { email: args.email }});
    if(!user) throw new Error(`No such user found for email ${args.email}`);
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await context.db.mutation.updateUser({
      where: { email: args.email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
    const mailResponse = await transport.sendMail({
      from: 'cheers@brittarodenbeck.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(
        `Your password reset token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset your password</a>.`
      ),
    });
    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, context, info) {
    if(args.password !== args.confirmPassword) throw new Error('Your passwords do not match');
    const [user] = await context.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000, // within in the past hour
      },
    });
    if(!user) throw new Error('This token is either invalid or expired');
    const password = await bcrypt.hash(args.password, 10);
    const updatedUser = await context.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 31536000000, // 1 year
    });
    return updatedUser;
  },
};

module.exports = mutations;
