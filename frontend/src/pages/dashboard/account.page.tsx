import { DynamicIcon } from "@/components/dynamic-icon";
import PopUpInput from "@/components/molecules/pop-up-input.molecule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import {
  getQueryKeyAllAccount,
  useCreateAccount,
  useGetAllAccount,
} from "@/lib/queries/account.query";
import {
  createAccountSchema,
  type CreateAccountDTO,
} from "@/lib/types/account.type";
import type { ChildrenProps } from "@/lib/types/components.type";
import type {
  AccountSoryByParam,
  AccountTypeParam,
  SortOrderParam,
} from "@/lib/types/options-param";
import { formatCurrency } from "@/lib/utils/currency-format.utils";
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import type { z } from "zod";

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateSearchParams();
  const queryClient = useQueryClient();

  const page = getNumberParam(searchParams, "page", 1);
  const limit = getNumberParam(searchParams, "limit", 25);
  const search = searchParams.get("search") ?? "";
  const sortBy = getAccountSoryByParam(searchParams, "updatedAt");
  const sortOrder = getSortOrderParam(searchParams, "desc");
  const type = getAccountTypeParam(searchParams, "all");

  const { data, isLoading, isError } = useGetAllAccount({
    optionParams: { page, limit, search, sortBy, sortOrder, type },
  });

  const createAccountMutate = useCreateAccount({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKeyAllAccount({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            type,
          }),
        });
      },
    },
  });

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

  const handleCreateAccount = async (data: CreateAccountDTO) => {
    await createAccountMutate.mutateAsync(data);
  };

  // search Query
  const [searchState, setSearchState] = useState<string>(search);
  const [searchDebounce] = useDebounce(searchState, 1000);

  // sort by query
  const [sortByState, setSortByState] = useState<AccountSoryByParam>(sortBy);

  // sort order query
  const [sortOrderState, setSortOrderState] =
    useState<SortOrderParam>(sortOrder);
  const [isAsc, setIsAsc] = useState<boolean>(false);

  const handleSortOrderState = () => {
    setIsAsc(() => !isAsc);
    if (isAsc) setSortOrderState("asc");
    else setSortOrderState("desc");
  };

  // type query
  const [typeState, setTypeState] = useState<AccountTypeParam>(type);

  // page query
  const [pageState, setPageState] = useState<number>(page);

  const handlePageState = (action: "prev" | "next") => {
    if (action === "prev") setPageState(() => pageState - 1);
    if (action === "next") setPageState(() => pageState + 1);
  };

  // limit query
  const [limitState, setLimitState] = useState<number>(limit);

  // limit,search,sortBy,sortOrder,type watcher
  useEffect(() => {
    updateParams({
      search: searchDebounce,
      sortBy: sortByState,
      sortOrder: sortOrderState,
      type: typeState,
      limit: limitState,
      page: null,
    });
  }, [
    updateParams,
    searchDebounce,
    sortByState,
    sortOrderState,
    typeState,
    limitState,
  ]);

  // page watcher
  useEffect(() => {
    updateParams({ page: pageState });
  }, [updateParams, pageState]);

  if (isError) return <h1>error</h1>;
  if (!data?.data) return <h1>no data</h1>;
  if (!data.meta) return <h1>no meta data</h1>;

  return (
    <section className="flex flex-col px-4 divide-y divide-accent group-has-data-[collapsible=icon]/sidebar-wrapper:py-4">
      <div className="grid grid-cols-12 items-center gap-4 py-4 *:flex *:flex-col *:gap-2">
        <span className="col-span-12 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-6 lg:col-span-6">
          <Label htmlFor="search-account" className="text-muted-foreground">
            Search
          </Label>
          <Input
            placeholder="search account..."
            type="search"
            id="search-account"
            iconPosition="in"
            icon={<Search className="text-muted-foreground" />}
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
          />
        </span>

        <span className="col-span-6 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-3 lg:col-span-3">
          <Label htmlFor="sort-by" className="text-muted-foreground">
            Sort By
          </Label>
          <Select
            value={sortByState}
            onValueChange={(v) => setSortByState(v as AccountSoryByParam)}
          >
            <SelectTrigger className="w-full" id="sort-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="balance">balance</SelectItem>
                <SelectItem value="createdAt">created at</SelectItem>
                <SelectItem value="updatedAt">updated at</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>

        <span className="col-span-5 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-2 lg:col-span-2">
          <Label htmlFor="account-type" className="text-muted-foreground">
            Filter By Type
          </Label>
          <Select
            value={typeState}
            onValueChange={(v) => setTypeState(v as AccountTypeParam)}
          >
            <SelectTrigger className="w-full" id="account-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="cash">cash</SelectItem>
                <SelectItem value="e_wallet">e wallet</SelectItem>
                <SelectItem value="bank">bank</SelectItem>
                <SelectItem value="investment">investment</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>

        <span className="col-span-1 place-items-center group-has-data-[collapsible=icon]/sidebar-wrapper:place-items-start lg:place-items-start mt-auto">
          <Button type="button" onClick={handleSortOrderState} size={"icon-lg"}>
            <ArrowUpDown />
          </Button>
        </span>

        <PopUpInput
          buttonLabel="Add Account"
          titleContent="Add New Account"
          descriptionContent="Fill in the details to create a new account"
          className="col-span-12"
        >
          <form
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
                      <FieldLabel htmlFor="account-name">
                        Account Name
                      </FieldLabel>
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
                      <FieldLabel htmlFor="account-type">
                        Account Type
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                      <FieldLabel htmlFor="account-currency">
                        Currency
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                  <Button> Cancel </Button>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </PopUpInput>
      </div>

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
                    <Card
                      key={item.id}
                      className="bg-radial-[at_25%_25%] h-fit from-muted from-50% to-primary/10 shadow-xl hover:scale-101 transition-all hover:from-5% ease-in-out"
                      onClick={() => {
                        alert(item.id);
                      }}
                    >
                      <CardHeader>
                        <DynamicIcon
                          name={getAccountIcon(item.type)}
                          className="min-w-10 min-h-10 bg-primary text-primary-foreground p-1.5 rounded-xl"
                        />
                        <CardDescription>
                          <h1 className="text-2xl text-foreground font-bold truncate mt-3">
                            {formatCurrency(item.balance, item.currency_code)}
                          </h1>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <span className="flex items-center gap-2 text-sm">
                          <h1 className="uppercase text-foreground font-bold">
                            {item.name}
                          </h1>
                          <h1 className="bg-muted text-muted-foreground shadow-lg px-2 rounded-lg">
                            {item.type}
                          </h1>
                          <h1 className="bg-primary text-primary-foreground px-2 rounded-lg">
                            {item.currency_code}
                          </h1>
                        </span>
                      </CardFooter>
                    </Card>
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
