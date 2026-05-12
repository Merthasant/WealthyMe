import ContinueWithAuth from "@/components/molecules/auth/continue-with.auth";
import AuthContainer from "@/components/organisms/auth/container";
import AuthFormContainer from "@/components/organisms/auth/form-container";
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
import { Mail, RectangleEllipsis, TicketCheck, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({ message: "name is required!" })
    .min(2, { message: "user name must be at least 2 characters" }),
  email: z.email({ message: "invalid email format" }),
  password: z
    .string({ message: "password is required!" })
    .min(6, { message: "password must be at least 6 characters" }),
  confPassword: z
    .string({ message: "confirm password is required!" })
    .min(6, { message: "confirm password must be at least 6 characters" }),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterValues) => {
    console.log(data);
  };
  return (
    <AuthContainer>
      <AuthFormContainer>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend>
              <h1 className="text-2xl lg:text-3xl font-bold">
                Welcome to{" "}
                <span>
                  <span className="text-primary">Wealty</span>
                  <span className="text-muted-foreground font-light">Me</span>
                </span>{" "}
                Website
              </h1>
            </FieldLegend>
            <FieldDescription>
              easy to manage you transaction in your pesonality
            </FieldDescription>

            <FieldGroup>
              {/* name input controller */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="name here..."
                      icon={<User />}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* email input controller */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="email here..."
                      icon={<Mail />}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* password input controller */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      placeholder="password here..."
                      icon={<RectangleEllipsis />}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/*confirm password input controller */}
              <Controller
                name="confPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="confPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confPassword"
                      placeholder="confirm password..."
                      icon={<TicketCheck />}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* submit */}

              <Field>
                <Button className="font-bold" type="submit">
                  Add new account
                </Button>
              </Field>

              <FieldSeparator>Or Continue With</FieldSeparator>

              <ContinueWithAuth />

              <Field>
                <p className="text-center text-sm text-muted-foreground col-span-2">
                  have a account?{" "}
                  <Link to="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </AuthFormContainer>
      <div className="bg-primary/20 p-12 rounded-2xl shadow-lg w-1/2 h-full hidden lg:flex items-center justify-center">
        <h1 className="text-muted-foreground text-4xl font-bold">
          Ilustration is coming soon
        </h1>
      </div>
    </AuthContainer>
  );
}
