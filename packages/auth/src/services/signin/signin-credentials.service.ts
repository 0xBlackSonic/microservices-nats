import { AuthProviders } from "../../enums/providers.enum";
import { Session, SigninService } from "./signin.service";

export class SigninCredentialsService extends SigninService {
  constructor(provider: AuthProviders) {
    super(provider);
  }

  async verify(email: string, password: string): Promise<Session> {
    await this._verifyUser(email, password);

    await this._generateSessionTokens()

    return {
      user: this._user!,
      jwt: this._jwt!,
      refresh: this._refresh!,
    };
  }
}