import { AuthProviders } from "../enums/providers.enum";
import { BadRequestError } from "../errors/bad-request.error";
import { EmailSendError } from "../errors/email-send.error";
import { User, UserDoc } from "../models/user.model";
import { mailService } from "./mail.service";
import { emailConfig } from "../configs/email.config";
import { SMTPLoader } from "../loaders/mail.loader";

export class SignupService {
  private _user?: UserDoc;
  private _accessToken?: string;
  private _jwt?: string;
  private _refresh?: string;
  private _responseCode?: number;

  constructor(private _provider: AuthProviders) {}

  get user() {
    if (!this._user) {
      throw new BadRequestError("User is not defined");
    }
    if (this._provider !== AuthProviders.Credentials) {
      return { user: this._user, accessToken: this._accessToken };
    } else {
      return this._user;
    }
  }

  get accessToken() {
    if (!this._accessToken) {
      throw new BadRequestError("AccessToken is not defined");
    }

    return this._accessToken;
  }

  get sessionTokens() {
    if (this._provider !== AuthProviders.Credentials) {
      return null;
    } else if (!this._jwt || !this._refresh) {
      throw new BadRequestError("Session tokens are not defined");
    }

    return { jwt: this._jwt, refresh: this._refresh };
  }

  get responseCode() {
    if (!this._responseCode) {
      throw new BadRequestError("Response code is not defined");
    }

    return this._responseCode;
  }

  async buildUser(email: string, password?: string): Promise<void> {
    const savedUser = await User.findOne({
      email,
      "accounts.provider": this._provider,
    });

    switch (this._provider) {
      case AuthProviders.Credentials:
        await this._buildWithCredentials(email, password!, !!savedUser);
        break;
      case AuthProviders.Email:
        await this._buidlWithEmail(email);
        break;
      default:
        throw new BadRequestError("Provider does not exist!");
    }
  }

  private async _buildWithCredentials(
    email: string,
    password: string,
    userExist: boolean
  ): Promise<void> {
    if (userExist) {
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

  private async _buidlWithEmail(email: string): Promise<void> {
    const { user, accessToken } = await User.buildSession({
      provider: this._provider,
      email,
    });
    await user.save();

    this._user = user;
    this._accessToken = accessToken;

    if (SMTPLoader.isActive()) {
      try {
        await mailService.send({
          from: emailConfig.from,
          to: user.email,
          subject: emailConfig.subject,
          html: emailConfig.template(this._user.email, this._accessToken),
        });
      } catch (err) {
        console.log(err);
      }
    }

    this._responseCode = 200;
  }

  private async _generateSessionTokens() {
    this._jwt = this._user!.generateJwtToken();
    this._refresh = await this._user!.generateRefreshToken();
  }
}
