import { useIsMobile } from "@/hooks/use-mobile";
import PopUpInput from "../pop-up-input.molecule";
import { Button } from "@/components/ui/button";
import { DiamondPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  createAccountSchema,
  type CreateAccountDTO,
} from "@/lib/types/account.type";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountOptionParams } from "@/lib/types/options-param";
import {
  getQueryKeyAllAccount,
  useCreateAccount,
} from "@/lib/queries/account.query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAccountBtnProps {
  queryKeyAllAccounts: AccountOptionParams;
}

export default function CreateAccountBtn({
  queryKeyAllAccounts,
}: CreateAccountBtnProps) {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // create account mutation
  const createAccountMutate = useCreateAccount({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKeyAllAccount(queryKeyAllAccounts),
        });
      },
    },
  });

  // form create account
  const formCreateAccount = useForm<
    z.input<typeof createAccountSchema>,
    unknown,
    z.output<typeof createAccountSchema>
  >({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "new account",
      balance: 0,
      type: "cash",
      currency_code: "IDR",
    },
  });

  // create account handler

  const [isCreateAccountOpen, setIsCreateAccountOpen] =
    useState<boolean>(false);

  const handleCreateAccount = async (data: CreateAccountDTO) => {
    await createAccountMutate.mutateAsync(data);
    setIsCreateAccountOpen(false);
    formCreateAccount.reset();
  };

  return (
    <PopUpInput
      titleContent="Add New Account"
      openProp={isCreateAccountOpen}
      onOpenChangeProp={setIsCreateAccountOpen}
      descriptionContent="Fill in the details to create a new account"
      triggerComponent={
        isMobile ? (
          <Button className="fixed right-5 bottom-5 h-16 w-16 hover:w-fit hover:px-4 group rounded-full z-40 transition-all">
            <span className="flex items-center gap-1 ">
              <p className="hidden group-hover:block text-xl">Create</p>
              <DiamondPlus className="size-7" />
            </span>
          </Button>
        ) : (
          <Button className="col-span-12 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:col-span-2 w-fit h-fit ms-auto xl:col-span-2 lg:place-items-start px-4 py-2 mt-auto">
            <span className="flex items-center gap-1">
              <DiamondPlus />
              <p>Create</p>
            </span>
          </Button>
        )
      }
    >
      <form
        className="p-4"
        onSubmit={formCreateAccount.handleSubmit((data) => {
          handleCreateAccount(data);
        })}
      >
        <FieldSet>
          <FieldGroup>
            <Controller
              control={formCreateAccount.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-name">Account Name</FieldLabel>
                  <Input id="account-name" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={formCreateAccount.control}
              name="balance"
              render={({ field: { onChange, ...fields }, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-balance">
                    Account Balance
                  </FieldLabel>
                  <Input
                    id="account-balance"
                    type="number"
                    min={0}
                    step={0.01}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      onChange(isNaN(value) ? 0 : value);
                    }}
                    {...fields}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={formCreateAccount.control}
              name="type"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="account-type">Account Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="e_wallet">E-Wallet</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              control={formCreateAccount.control}
              name="currency_code"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="account-currency">Currency</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="account-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Field>
              {!isMobile && <Button variant={"outline"}> Cancel </Button>}
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </PopUpInput>
  );
}
