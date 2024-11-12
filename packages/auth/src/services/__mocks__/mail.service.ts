import { config } from "../../configs";
import { MailOptions } from "../mail.service";

export const mailService = {
  send: jest
    .fn()
    .mockImplementation((mailOptions: MailOptions) => Promise.resolve()),
  isActive: config.smtp.active,
};
