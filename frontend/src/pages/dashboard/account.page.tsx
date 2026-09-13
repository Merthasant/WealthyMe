import { DynamicIcon } from "@/components/dynamic-icon";
import AccountFilters from "@/components/organisms/account/account-filters";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  getQueryKeyAllAccount,
  getQueryKeyOneAccount,
  useGetAllAccount,
  useGetOneAccount,
  useUpdateAccount,
} from "@/lib/queries/account.query";
import {
  accountTypeList,
  currencyCodeList,
  updateAccountSchema,
  type Accounts,
  type UpdateAccountDTO,
} from "@/lib/types/account.type";
import type { ChildrenProps } from "@/lib/types/components.type";
import type { AccountOptionParams } from "@/lib/types/options-param";
import { formatCurrency } from "@/lib/utils/currency-format.utils";
import { unixToRelativeTime } from "@/lib/utils/date.utils";
import { getAccountIcon } from "@/lib/utils/get-account-icon.utils";
import {
  getAccountSoryByParam,
  getAccountTypeParam,
  getNumberParam,
  getSortOrderParam,
} from "@/lib/utils/get-params.utils";
import { useUpdateSearchParams } from "@/lib/utils/set-params.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookA,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import type { z } from "zod";

export default function AccountPage() {
  const [searchParams] = useSearchParams();

  // update bulk params
  const updateParams = useUpdateSearchParams();

  const isMobile = useIsMobile();

  // query params
  const page = getNumberParam(searchParams, "page", 1);
  const limit = getNumberParam(searchParams, "limit", 25);
  const search = searchParams.get("search") ?? "";
  const sortBy = getAccountSoryByParam(searchParams, "updatedAt");
  const sortOrder = getSortOrderParam(searchParams, "desc");
  const type = getAccountTypeParam(searchParams, "all");

  // get all accounts data
  const { data, isLoading, isError } = useGetAllAccount({
    optionParams: { page, limit, search, sortBy, sortOrder, type },
  });

  // get account by id query
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );

  const { data: accountData, isLoading: accountLoading } = useGetOneAccount({
    id: accountIdSelected!,
    queryConfig: {
      enabled: !!accountIdSelected,
    },
  });

  // detail account handler

  const handleOpenAccountDetail = (accountId: string) => {
    setAccountIdSelected(accountId);
  };
  // limit query
  const [limitState, setLimitState] = useState<number>(limit);

  // page query
  const [pageState, setPageState] = useState<number>(page);
  const handlePageState = (action: "prev" | "next") => {
    if (action === "prev") setPageState(() => pageState - 1);
    if (action === "next") setPageState(() => pageState + 1);
  };

  // limit watcher
  useEffect(() => {
    updateParams({ limit: limitState });
  }, [updateParams, limitState]);

  // page watcher
  useEffect(() => {
    updateParams({ page: pageState });
  }, [updateParams, pageState]);

  if (isError) return <h1>error</h1>;
  if (!data?.data) return <h1>no data</h1>;
  if (!data.meta) return <h1>no meta data</h1>;

  return (
    <section className="flex flex-col px-4 divide-y divide-accent group-has-data-[collapsible=icon]/sidebar-wrapper:py-4">
      <AccountFilters
        queryKeyAllAccounts={{ search, page, limit, sortBy, sortOrder, type }}
      />

      <ContainerScroller>
        {isLoading ? (
          <Container>
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <Skeleton id={index.toString()} />
              ))}
          </Container>
        ) : (
          <>
            {data?.data && data.data[0] ? (
              <Container>
                {data &&
                  data.data?.map((item) => (
                    <AccountCard
                      key={item.id}
                      data={item}
                      onClick={() => handleOpenAccountDetail(item.id)}
                    />
                  ))}
              </Container>
            ) : (
              <h1>empty</h1>
            )}
          </>
        )}
      </ContainerScroller>

      <div className="flex items-center py-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            size={"icon"}
            onClick={() => handlePageState("prev")}
            disabled={pageState <= 1}
          >
            <ChevronLeft />
          </Button>

          <Label> {pageState}</Label>

          <Button
            type="button"
            size={"icon"}
            onClick={() => handlePageState("next")}
            disabled={pageState >= data.meta.totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
        <span className="ms-auto flex gap-3 items-center">
          <h1 className="text-muted-foreground text-sm">Showing</h1>
          <Select
            value={limitState.toString()}
            onValueChange={(v) => setLimitState(Number(v))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <h1 className="text-muted-foreground text-sm">entries per page</h1>
        </span>
      </div>
      {/* update account drawer */}
      <Drawer
        direction={isMobile ? "bottom" : "right"}
        open={!!accountIdSelected}
        onOpenChange={(open) => !open && setAccountIdSelected(null)}
      >
        <AccountDetail
          accountData={accountData?.data}
          isLoading={accountLoading}
          queryKeyAllAccount={{ page, limit, search, sortBy, sortOrder, type }}
        />
      </Drawer>
    </section>
  );
}

const Container = ({ children }: ChildrenProps) => {
  return (
    <section className="grid grid-cols-1 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:grid-cols-2 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {children}
    </section>
  );
};

export const ContainerScroller = ({ children }: ChildrenProps) => {
  return (
    <section className="group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-[79vh] min-h-[76vh] px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/20 scrollbar-track-transparent">
      {children}
    </section>
  );
};

interface AccountCardProps {
  data: Accounts;
  onClick?: () => void;
}

export const AccountCard = ({ data, onClick }: AccountCardProps) => {
  return (
    <Card
      className="bg-radial-[at_25%_25%] h-fit from-muted from-50% to-primary/10 shadow-xl hover:scale-101 transition-all hover:from-5% ease-in-out"
      onClick={onClick}
    >
      <CardHeader>
        <DynamicIcon
          name={getAccountIcon(data.type)}
          className="min-w-10 min-h-10 bg-primary text-primary-foreground p-2 rounded-xl"
        />
        <CardDescription>
          <h1 className="text-2xl text-foreground font-bold truncate mt-3">
            {formatCurrency(data.balance, data.currency_code)}
          </h1>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <span className="flex items-center gap-2 text-sm">
          <h1 className="uppercase text-foreground font-bold">{data.name}</h1>
          <span className="bg-muted text-muted-foreground shadow-lg px-2 rounded-lg">
            {data.type}
          </span>
          <span className="bg-primary text-primary-foreground px-2 rounded-lg">
            {data.currency_code}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
};

interface AccountDetailProps {
  accountData: Accounts | null | undefined;
  isLoading: boolean;
  queryKeyAllAccount: AccountOptionParams;
}

export const AccountDetail = ({
  accountData,
  isLoading,
  queryKeyAllAccount,
}: AccountDetailProps) => {
  const queryClient = useQueryClient();
  const [activeTabs, setActiveTabs] = useState<"view" | "edit">("view");

  // update account mutation
  const updateAccountMutate = useUpdateAccount({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKeyAllAccount(queryKeyAllAccount),
        });

        if (accountData)
          queryClient.invalidateQueries({
            queryKey: getQueryKeyOneAccount(accountData.id),
          });
      },
    },
  });

  // from update account
  const formUpdateAccount = useForm<
    z.input<typeof updateAccountSchema>,
    unknown,
    z.output<typeof updateAccountSchema>
  >({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      balance: Number(accountData?.balance),
      name: accountData?.name,
      currency_code: accountData?.currency_code,
      type: accountData?.type,
    },
  });

  // agar default value form ada
  useEffect(() => {
    if (accountData) {
      formUpdateAccount.reset({
        balance: Number(accountData.balance),
        name: accountData.name,
        currency_code: accountData.currency_code,
        type: accountData.type,
      });
    }
  }, [accountData, formUpdateAccount]);

  const watchUpdateAccount = useWatch({ control: formUpdateAccount.control });

  const isUnchanged =
    watchUpdateAccount.balance === accountData?.balance &&
    watchUpdateAccount.name === accountData?.name &&
    watchUpdateAccount.currency_code === accountData?.currency_code &&
    watchUpdateAccount.type === accountData?.type;

  const handleUpdateAccount = async (
    data: UpdateAccountDTO,
    accountId: string,
  ) => {
    await updateAccountMutate.mutateAsync({ dto: data, id: accountId });
    formUpdateAccount.reset();
    setActiveTabs("view");
  };

  if (isLoading) return <Skeleton />;
  if (!accountData)
    return (
      <DrawerContent>
        <h1>account not found!</h1>
      </DrawerContent>
    );

  return (
    <DrawerContent className="px-6">
      <DrawerHeader>
        <h1 className="text-xl font-bold text-primary border-b-2 border-primary pb-2">
          <span>Account Details</span>
        </h1>
      </DrawerHeader>
      <Card className="px-4 flex h-120 mb-4">
        <Tabs
          value={activeTabs}
          onValueChange={(v) => setActiveTabs(v as "view" | "edit")}
        >
          <TabsList variant={"line"} className="flex-1 min-w-0 w-full ">
            <TabsTrigger value="view">view</TabsTrigger>
            <TabsTrigger value="edit">edit</TabsTrigger>
          </TabsList>
          <TabsContent value="view">
            <div className="flex flex-col justify-center pb-8 gap-4 ">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex flex-col gap-2 h-32 justify-center">
                <p className=" text-xl font-bold">Balance:</p>
                <p className="px-3 text-3xl py-2 font-black text-center bg-primary-foreground/10 rounded-lg">
                  {formatCurrency(
                    accountData.balance,
                    accountData.currency_code,
                  )}
                </p>
              </div>

              <div className=" bg-radial-[at_25%_25%] from-muted from-50% to-primary/10 shadow-xl hover:scale-101 transition-all hover:from-5% ease-in-out rounded-lg divide-y divide-foreground/10 px-4 *:h-16">
                <span className="flex gap-4 py-2 items-center">
                  <BookA className="place-self-center text-destructive bg-destructive/10 p-2 rounded-lg size-10 shadow-md" />

                  <div className="flex flex-col">
                    <h1 className="text-sm text-destructive/40">Name</h1>
                    <p className="text-foreground text-sm">
                      {accountData.name}
                    </p>
                  </div>
                </span>
                <span className="flex gap-4 py-2 items-center">
                  <CreditCard className="place-self-center text-muted-foreground/60 bg-muted/40 p-2 rounded-lg size-10 shadow-md" />

                  <div className="flex flex-col">
                    <h1 className="text-sm text-muted-foreground/60">
                      Currency
                    </h1>
                    <p className="text-foreground text-sm">
                      {accountData.currency_code}
                    </p>
                  </div>
                </span>
                <span className="flex gap-4 py-2 items-center">
                  <Receipt className="place-self-center text-primary bg-primary/10 rounded-lg  p-2 size-10 shadow-md" />

                  <div className="flex flex-col">
                    <h1 className="text-sm text-primary/60">Type</h1>
                    <p className="text-foreground text-sm">
                      {accountData.type}
                    </p>
                  </div>
                </span>
              </div>

              <span className="bg-accent w-fit px-4 py-2 rounded-lg text-sm text-muted-foreground">
                {accountData.updatedAt > accountData.createdAt
                  ? `last updated ${unixToRelativeTime(accountData.updatedAt)}`
                  : `created ${unixToRelativeTime(accountData.createdAt)}`}
              </span>
            </div>
          </TabsContent>
          <TabsContent value="edit">
            <section>
              <form
                onSubmit={formUpdateAccount.handleSubmit((data) => {
                  handleUpdateAccount(data, accountData.id);
                })}
              >
                <FieldSet>
                  <FieldLegend></FieldLegend>
                  <FieldDescription></FieldDescription>

                  <FieldGroup>
                    {/* balance */}
                    <Controller
                      control={formUpdateAccount.control}
                      name="balance"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="balance">Balance</FieldLabel>
                          <Input
                            id="balance"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {/* name */}
                    <Controller
                      control={formUpdateAccount.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="name">Name</FieldLabel>
                          <Input id="name" type="text" {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {/* currency code */}
                    <Controller
                      control={formUpdateAccount.control}
                      name="currency_code"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="currency_code">
                            Currency Code
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="currency_code">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencyCodeList.map((code) => (
                                <SelectItem key={code} value={code}>
                                  {code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    {/* type */}
                    <Controller
                      control={formUpdateAccount.control}
                      name="type"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="type">Type</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {accountTypeList.map((accountType) => (
                                <SelectItem
                                  key={accountType}
                                  value={accountType}
                                >
                                  {accountType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    <Field>
                      <Button type="submit" disabled={isUnchanged}>
                        change
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
            </section>
          </TabsContent>
        </Tabs>
      </Card>
    </DrawerContent>
  );
};
