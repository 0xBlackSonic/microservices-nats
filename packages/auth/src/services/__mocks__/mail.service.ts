import { config } from "../../configs";
import { MailOptions } from "../mail.service";

export const mailService = {
  send: jest.fn().mockImplementation((mailOptions: MailOptions): void => {}),
  isActive: config.smtp.active,
};
