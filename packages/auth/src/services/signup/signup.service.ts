import { BadRequestError } from "@goblit/shared";

import { AuthProviders } from "../../enums/providers.enum";
import { UserDoc } from "../../models/user.model";

export interface IEmailResponse {
  user: UserDoc;
  accessToken: string;
}

export abstract class SignupService {
  protected _user?: UserDoc;
  protected _responseCode?: number;

  constructor(protected _provider: AuthProviders) {}

  abstract get user(): UserDoc | IEmailResponse | null;

  abstract get sessionTokens(): null | { jwt: string, refresh: string }

  get responseCode() {
    if (!this._responseCode) {
      throw new BadRequestError("Response code is not defined");
    }

    return this._responseCode;
  }

  abstract buildUser(email: string, password?: string): Promise<void>;
}
