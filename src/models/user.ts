import mongoose from "mongoose";
import { HashService } from "../services/hash-service";
import { UserStatus } from "../enums/user-status";
import { jwtService } from "../services/jwt-service";
import { AuthProviders } from "../enums/providers";

interface UserAttrs {
  provider: AuthProviders;
  email: string;
  password?: string;
  expiration?: number;
}

interface UserDoc extends mongoose.Document {
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
  buildSession(attrs: UserAttrs): Promise<UserDoc>;
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
  return new User({
    email: attrs.email,
    accounts: [
      {
        provider: attrs.provider,
        accessToken: await HashService.toHash(attrs.password!),
        expires: attrs.expiration,
      },
    ],
  });
};

userSchema.statics.buildSession = async (attrs: UserAttrs) => {
  const user = await User.findOne({ email: attrs.email });
  const accessToken = HashService.generateAccessToken();
  Date.now();
  const expires = Date.now() + Number(process.env.ONE_USE_TOKEN_EXPIRARION!);

  const newAccount = {
    provider: attrs.provider,
    accessToken,
    expires,
  };

  if (!user) {
    return new User({
      email: attrs.email,
      accounts: [newAccount],
    });
  }

  const userAccount = user.accounts.find(
    (acc: any) => acc.provider === attrs.provider
  );

  if (userAccount) {
    userAccount.accessToken = accessToken;
    userAccount.expires = expires;
    userAccount.active = true;
  } else {
    user.accounts.push(newAccount);
  }

  return user;
};

userSchema.statics.removeSession = async (userId: string, token?: string) => {
  let user: UserDoc | null;
  let tokenHash: string;

  if (token) {
    tokenHash = HashService.tokenHash(token);
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
  const token = jwtService.generateJWT({
    id: this._id,
    email: this.email,
  });

  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = jwtService.generateRefresh({
    id: this._id,
    email: this.email,
  });

  this.sessions.push({
    sessionToken: HashService.tokenHash(token),
    expires: jwtService.getExpirationTime(token),
  });
  await this.save();

  return token;
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
