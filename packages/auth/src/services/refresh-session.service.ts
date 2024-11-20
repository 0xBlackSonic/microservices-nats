import { AuthenticationError, jwtUtils, Payload } from "@goblit/shared";

import { User } from "../models/user.model";
import { HashUtils } from "../helpers/hash.utils";
import { TokenExpiredError } from "jsonwebtoken";
import { Request } from "express";

export interface RequestSession {
  jwt: string;
  refresh: string;
}

export class RefreshSession {
  constructor(private _session: RequestSession) {}

  async refresh() {
    try {
      if (!this._accessTokenExpired()) {
        return this._session;
      }

      const payload = jwtUtils.verifyRefresh(this._session!.refresh);

      const user = await User.findOne({
        email: payload.email,
        "sessions.sessionToken": HashUtils.tokenHash(this._session!.refresh),
      });

      if (user) {
        this._session!.jwt = user.generateJwtToken();

        return this._session;
      }
    } catch (err) {
      const { id } = jwtUtils.extractPayload(this._session!.refresh);

      await User.removeSession(id, this._session!.refresh);

      return null;
    }
  }

  private _accessTokenExpired() {
    try {
      jwtUtils.verifyJWT(this._session!.jwt);

      return false;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return true;
      }

      throw new Error("Access token is not valid");
    }
  }
}
