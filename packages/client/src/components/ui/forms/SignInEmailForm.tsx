import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Wrong email format"),
});

type EmailForm = z.infer<typeof schema>;

export const SignInEmailForm = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<EmailForm> = async (data) => {
    try {
      await axios.post("/api/auth/signup", {
        provider: "email",
        email: data.email,
      });
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

      <div className="flex flex-col items-center mt-8">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};
