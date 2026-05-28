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
import { authRegister } from "@/lib/APIs/services/auth.service";
import {
  createUserInputSchema,
  type CreateUserInput,
} from "@/lib/types/user.type";
import { useAuthContext } from "@/provider/auth/auth.provider.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, RectangleEllipsis, TicketCheck, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";

export default function RegisterPage() {
  const { user, setUser, isLoading } = useAuthContext();

  const mutate = useMutation({
    mutationFn: (data: CreateUserInput) => authRegister(data),
    onSuccess: (data) => {
      const { token: _, ...user } = data.data;
      setUser(user);
      if (!isLoading) return <Navigate to={"/dashboard"} />;
    },
  });

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confPassword: "",
      role: "user",
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    await mutate.mutateAsync(data);
  };

  if (isLoading) return <h1>Loading</h1>;
  if (user) return <Navigate to={"/dashboard"} />;

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
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="name here..."
                      aria-invalid={fieldState.invalid}
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
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="email here..."
                      aria-invalid={fieldState.invalid}
                      type="email"
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
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      placeholder="password here..."
                      aria-invalid={fieldState.invalid}
                      type="password"
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
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confPassword"
                      type="password"
                      aria-invalid={fieldState.invalid}
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
