import { AuthenticationError, jwtUtils, Payload } from "@goblit/shared";

import { User } from "../models/user.model";
import { HashUtils } from "../helpers/hash.utils";

export interface RequestSession {
  jwt: string;
  refresh: string;
}

export class RefreshSession {
  constructor(private _session: RequestSession) {}

  async refresh() {
    try {
      const payload = jwtUtils.verifyRefresh(this._session.refresh);

      const user = await User.findOne({
        _id: payload.id,
        "sessions.sessionToken": HashUtils.tokenHash(this._session.refresh),
      });

      if (user) {
        this._session.jwt = user.generateJwtToken();

        return this._session;
      }
    } catch (err) {
      const { id } = jwtUtils.extractPayload(this._session.refresh);

      await User.removeSession(id, this._session.refresh);

      throw new AuthenticationError("Session expired");
    }
  }
}
