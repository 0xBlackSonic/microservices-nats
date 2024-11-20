import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSession } from "../providers/session-provider";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Wrong email format"),
  password: z.string().min(1, "Password is required"),
});

type CredentialsForm = z.infer<typeof schema>;

export const SignInCredentialsForm = () => {
  const { signin } = useSession();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<CredentialsForm> = async (data) => {
    try {
      await signin("credentials", data);
    } catch (err: any) {
      if (err.response.data.errors) {
        setServerErrors(
          err.response.data.errors.map((err: any) => err.message)
        );
      } else {
        setServerErrors([err.message]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverErrors.length > 0 && (
        <ul className="text-center text-red-400 p-2 mb-6 rounded text-sm">
          {serverErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <div className="mb-6">
        <Label className="pl-1 text-xs">Email</Label>
        <Input {...register("email")} type="text" />
        {errors.email && (
          <div className="text-red-400 text-xs">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-6">
        <Label className="pl-1 text-xs">Password</Label>
        <Input {...register("password")} type="password" />
        {errors.password && (
          <div className="text-red-400 text-xs">{errors.password.message}</div>
        )}
      </div>

      <div className="flex flex-col items-center mt-8">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};
