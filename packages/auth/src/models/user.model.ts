import mongoose from "mongoose";
import { jwtUtils } from "@goblit/shared";

import { HashUtils } from "../helpers/hash.utils";
import { UserStatus } from "../enums/user-status.enum";
import { AuthProviders } from "../enums/providers.enum";
import { config } from "../configs";

interface UserAttrs {
  provider: AuthProviders;
  email: string;
  password?: string;
  expiration?: number;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  status: UserStatus;
  sessions: {
    sessionToken: string;
    expires: number;
  }[];
  accounts: {
    provider: AuthProviders;
    accessToken: string;
    active?: boolean;
    expires?: number;
  }[];
  generateJwtToken(): string;
  generateRefreshToken(): Promise<string>;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): Promise<UserDoc>;
  buildSession(
    attrs: UserAttrs
  ): Promise<{ user: UserDoc; accessToken: string }>;
  removeSession(userId: string, token?: string): Promise<void>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    sessions: [
      {
        sessionToken: {
          type: String,
          required: true,
        },
        expires: {
          type: Number,
          required: true,
        },
      },
    ],
    accounts: [
      {
        provider: {
          type: String,
          required: true,
          enum: Object.values(AuthProviders),
        },
        accessToken: {
          type: String,
          required: true,
        },
        active: {
          type: Boolean,
          required: true,
          default: true,
        },
        expires: {
          type: Number,
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

userSchema.statics.build = async (attrs: UserAttrs) => {
  let user = await User.findOne({ email: attrs.email });
  const accessToken = await HashUtils.toHash(attrs.password!);

  const newAccount = {
    provider: attrs.provider,
    accessToken,
    expires: attrs.expiration,
  };

  if (!user) {
    user = new User({
      email: attrs.email,
      accounts: [newAccount],
    });
  } else {
    const userAccount = user.accounts.find(
      (acc: any) => acc.provider === attrs.provider
    );

    if (userAccount) {
      userAccount.accessToken = accessToken;
      userAccount.expires = attrs.expiration;
      userAccount.active = true;
    } else {
      user.accounts.push(newAccount);
    }
  }

  return user;
};

userSchema.statics.buildSession = async (attrs: UserAttrs) => {
  const accessToken = HashUtils.generateAccessToken();
  const expires = Date.now() + config.sessions.oneUseTokenExpires!;

  const user = await User.build({
    provider: attrs.provider,
    email: attrs.email,
    password: accessToken,
    expiration: expires,
  });

  return { user, accessToken };
};

userSchema.statics.removeSession = async (userId: string, token?: string) => {
  let user: UserDoc | null;
  let tokenHash: string;

  if (token) {
    tokenHash = HashUtils.tokenHash(token);
    user = await User.findOne({
      _id: userId,
      "sessions.sessionToken": tokenHash,
    });
  } else {
    user = await User.findById(userId);
  }

  if (user) {
    user.sessions = token
      ? user.sessions.filter((obj) => obj.sessionToken !== tokenHash)
      : [];
    await user.save();
  }
};

userSchema.methods.generateJwtToken = function () {
  const token = jwtUtils.generateJWT({
    id: this._id,
    email: this.email,
  });

  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = jwtUtils.generateRefresh({
    id: this._id,
    email: this.email,
  });

  this.sessions.push({
    sessionToken: HashUtils.tokenHash(token),
    expires: jwtUtils.getExpirationTime(token),
  });
  await this.save();

  return token;
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
