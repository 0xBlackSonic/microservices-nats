import { BadRequestError } from "@goblit/shared";
import { AuthProviders } from "../../enums/providers.enum";
import { Session, SigninService } from "./signin.service";

export class SigninEmailService extends SigninService {
  constructor(provider: AuthProviders) {
    super(provider);
  }

  async verify(email: string, password: string): Promise<Session> {
    await this._verifyUser(email, password);

    if (!this._userAccount!.active) {
      throw new BadRequestError("Access Token already used");
    }

    if (this._userAccount!.expires! < Date.now()) {
      throw new BadRequestError("Access Token expired");
    }

    this._userAccount!.active = false;
    await this._user!.save();

    await this._generateSessionTokens();

    return {
      user: this._user!,
      jwt: this._jwt!,
      refresh: this._refresh!,
    };
  }
}