import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

export const authRoutes = [signupRouter, signinRouter, signoutRouter];
