import { BadRequestError } from "@goblit/shared";

import { config } from "../../configs";
import { IEmailResponse, SignupService } from "./signup.service";
import { AuthProviders } from "../../enums/providers.enum";
import { User, UserDoc } from "../../models/user.model";
import { AuthEmailSignupPublisher } from "../../events/publishers/auth-email-signup.publisher";
import { natsLoader } from "../../loaders/nats.loader";

export class SignupEmailService extends SignupService {
  private _accessToken?: string;
  
  constructor(provider: AuthProviders) {
    super(provider);
  }

  get user(): IEmailResponse | null {
    if (!this._user) {
      throw new BadRequestError("User is not defined");
    }
    
    if (config.smtp.active) {
      return null;
    }

    return { user: this._user, accessToken: this._accessToken! };
  }

  get sessionTokens() { return null; }

  async buildUser(email: string): Promise<void> {
    const { user, accessToken } = await User.buildSession({
      provider: this._provider,
      email,
    });
    await user.save();

    config.smtp.active &&
      (await new AuthEmailSignupPublisher(
        natsLoader.jsManager,
        natsLoader.jsClient
      ).publish({
        email,
        accessToken,
      }));

    this._user = user;
    this._accessToken = accessToken;
    this._responseCode = 200;
  }
}