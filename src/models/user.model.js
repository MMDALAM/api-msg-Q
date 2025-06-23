const { default: mongoose } = require('mongoose');
const schema = mongoose.Schema;

const avatars = new schema({
  url: { type: String },
  path: { type: String },
  hash: { type: String},
});

const user = new schema(
  {
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String },
    avatar: {
      type: [avatars],
      default: [],
    },
    status: { type: String, default: 'offline' },
    role: { type: String, default: 'user' },
    token: { type: String },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    last_login: { type: Date },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  },
  { timestamps: true }
);

const userModel = mongoose.model('User', user);
module.exports = userModel;
