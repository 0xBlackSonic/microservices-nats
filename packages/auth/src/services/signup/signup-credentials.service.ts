import { BadRequestError } from "@goblit/shared";
import { AuthProviders } from "../../enums/providers.enum";
import { User, UserDoc } from "../../models/user.model";
import { SignupService } from "./signup.service";

export class SignupCredentialsService extends SignupService {
  private _jwt?: string;
  private _refresh?: string;

  constructor(provider: AuthProviders) {
    super(provider);
  }

  get user(): UserDoc {
    if (!this._user) {
      throw new BadRequestError("User is not defined");
    }
    
    return this._user;
  }

  get sessionTokens() {
    if (!this._jwt || !this._refresh) {
      throw new BadRequestError("Session tokens are not defined");
    }

    return { jwt: this._jwt, refresh: this._refresh };
  }

  async buildUser(email: string, password?: string): Promise<void> {
    const savedUser = await User.findOne({
      email,
      "accounts.provider": this._provider,
    });

    if (!!savedUser) {
      throw new BadRequestError("Credentials are not valid");
    }

    this._user = await User.build({
      provider: this._provider,
      email,
      password,
    });

    await this._user.save();
    await this._generateSessionTokens();
    this._responseCode = 201;
  }

  private async _generateSessionTokens() {
    this._jwt = this._user!.generateJwtToken();
    this._refresh = await this._user!.generateRefreshToken();
  }
}