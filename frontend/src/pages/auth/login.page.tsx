import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, RectangleEllipsis } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Link } from "react-router-dom";
import ContinueWithAuth from "@/components/molecules/auth/continue-with.auth";
import AuthFormContainer from "@/components/organisms/auth/form-container";
import AuthContainer from "@/components/organisms/auth/container";

const loginSchema = z.object({
  email: z.email({ message: "invalid email format" }),
  password: z
    .string({ message: "password is required" })
    .min(6, { message: "password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = (data: LoginValues) => {
    console.table(data);
  };
  return (
    <AuthContainer>
      <div className="bg-primary/20 p-12 rounded-2xl shadow-lg w-1/2 h-full hidden lg:flex items-center justify-center">
        <h1 className="text-muted-foreground text-4xl font-bold">
          Ilustration is coming soon
        </h1>
      </div>
      <AuthFormContainer>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend>
              <h1 className="text-3xl lg:text-4xl font-bold capitalize ">
                <span className="text-primary">Welcome</span> <span>Back</span>
              </h1>
            </FieldLegend>
            <FieldDescription>
              <h1>Sign in to your account below</h1>
            </FieldDescription>

            <FieldGroup>
              {/* field untuk email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      icon={<Mail size={21} />}
                      id="email"
                      type="email"
                      placeholder="email here..."
                      className="col-span-2"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* field untuk password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      icon={<RectangleEllipsis size={21} />}
                      id="password"
                      type="password"
                      placeholder="password here..."
                      className="col-span-2"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* field button submit */}
              <Field>
                <Button type="submit">Sign in to your account</Button>
              </Field>

              <FieldSeparator>
                <span> Or Continue With </span>
              </FieldSeparator>

              <ContinueWithAuth />

              <Field>
                <p className="text-center text-sm text-muted-foreground col-span-2">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </AuthFormContainer>
    </AuthContainer>
  );
}
