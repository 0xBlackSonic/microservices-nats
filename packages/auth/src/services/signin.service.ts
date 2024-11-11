import { AuthProviders } from "../enums/providers.enum";
import { User, UserDoc } from "../models/user.model";
import { HashUtils } from "../helpers/hash.utils";
import { BadRequestError } from "@goblit/shared";

interface IUserAccount {
  provider: AuthProviders;
  accessToken: string;
  active?: boolean;
  expires?: number;
}

export class SigninService {
  private _user?: UserDoc | null;
  private _jwt?: string;
  private _refresh?: string;

  constructor(private _provider: AuthProviders) {}

  get user(): { user: UserDoc; jwt: string; refresh: string } {
    if (!this._user || !this._jwt || !this._refresh) {
      throw new BadRequestError("User, JWT and Rfresh are not defined");
    }

    return {
      user: this._user,
      jwt: this._jwt,
      refresh: this._refresh,
    };
  }

  async verify(email: string, password: string): Promise<void> {
    this._user = await User.findOne({
      email,
      "accounts.provider": this._provider,
    });

    if (!this._user) {
      throw new BadRequestError("Credentials are invalid");
    }

    const userAccount: IUserAccount = this._user.accounts.find(
      (acc) => acc.provider === this._provider
    )!;

    await this._verifyAccess(password, userAccount!);

    await this._generateSessionTokens();
  }

  private async _verifyAccess(
    password: string,
    userAccount: IUserAccount
  ): Promise<void> {
    if (!(await HashUtils.verify(userAccount.accessToken, password))) {
      throw new BadRequestError("Credentials are invalid");
    }

    if (this._provider !== AuthProviders.Credentials) {
      if (!userAccount.active) {
        throw new BadRequestError("Access Token already used");
      }

      if (userAccount.expires! < Date.now()) {
        throw new BadRequestError("Access Token expired");
      }

      userAccount.active = false;
      await this._user!.save();
    }
  }

  private async _generateSessionTokens() {
    this._jwt = this._user!.generateJwtToken();
    this._refresh = await this._user!.generateRefreshToken();
  }
}
