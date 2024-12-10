import { AuthProviders } from "../../enums/providers.enum";
import { User, UserDoc } from "../../models/user.model";
import { HashUtils } from "../../helpers/hash.utils";
import { BadRequestError } from "@goblit/shared";

interface IUserAccount {
  provider: AuthProviders;
  accessToken: string;
  active?: boolean;
  expires?: number;
}

export interface Session {
    user: UserDoc;
    jwt: string;
    refresh: string;
}

export abstract class SigninService {
  protected _user?: UserDoc | null;
  protected _jwt?: string;
  protected _refresh?: string;
  protected _userAccount?: IUserAccount;

  constructor(protected _provider: AuthProviders) {}

  protected async _verifyUser(email: string, password: string) {
    this._user = await User.findOne({
      email,
      "accounts.provider": this._provider,
    });

    if (!this._user) {
      throw new BadRequestError("Credentials are invalid");
    }
    
    this._userAccount = this._user.accounts.find(
      (acc) => acc.provider === this._provider
    )!;

    if (!(await HashUtils.verify(this._userAccount.accessToken, password))) {
      throw new BadRequestError("Credentials are invalid");
    }
  }
  
  protected async _generateSessionTokens() {
    this._jwt = this._user!.generateJwtToken();
    this._refresh = await this._user!.generateRefreshToken();
  }
  
  abstract verify(email: string, password: string): Promise<Session>;
}
