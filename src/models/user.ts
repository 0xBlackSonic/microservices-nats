import mongoose from "mongoose";
import { HashUtils } from "../helpers/hash-utils";
import { UserStatus } from "../enums/user-status";
import { JwtUtils } from "../helpers/jwt-utils";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  status: UserStatus;
  tokens: { token: string }[];
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  removeSession(userId: string, token?: string): Promise<void>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        const { _id: id, email } = ret;

        return { id, email };
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await HashUtils.toHash(this.get("password"));
    this.set("password", hash);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.removeSession = async (userId: string, token?: string) => {
  let user: UserDoc | null;
  let tokenHash: string;

  if (token) {
    tokenHash = HashUtils.tokenHash(token);
    user = await User.findOne({
      _id: userId,
      "tokens.token": tokenHash,
    });
  } else {
    user = await User.findById(userId);
  }

  if (user) {
    user.tokens = token
      ? user.tokens.filter((obj) => obj.token !== tokenHash)
      : [];
    await user.save();
  }
};

userSchema.methods.generateAccessToken = async function () {
  const token = JwtUtils.generateJWT({
    id: this._id,
    email: this.email,
  });

  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = JwtUtils.generateRefresh({
    id: this._id,
    email: this.email,
  });

  this.tokens.push({ token: HashUtils.tokenHash(token) });
  await this.save();

  return token;
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
