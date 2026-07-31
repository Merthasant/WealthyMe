import { DynamicIcon } from "@/components/dynamic-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { useGetAllAccount } from "@/lib/queries/account.query";
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateSearchParams();

  const page = getNumberParam(searchParams, "page", 1);
  const limit = getNumberParam(searchParams, "limit", 25);
  const search = searchParams.get("search") ?? "";
  const sortBy = getAccountSoryByParam(searchParams, "updatedAt");
  const sortOrder = getSortOrderParam(searchParams, "desc");
  const type = getAccountTypeParam(searchParams, "all");

  const { data, isLoading, isError } = useGetAllAccount({
    optionParams: { page, limit, search, sortBy, sortOrder, type },
  });

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

  useEffect(() => {
    updateParams({ page: pageState });
  }, [updateParams, pageState]);

  if (isError) return <h1>error</h1>;
  if (!data?.data) return <h1>no data</h1>;
  if (!data.meta) return <h1>no meta data</h1>;

  return (
    <section className="flex flex-col">
      <div className="px-4 flex items-center gap-4">
        <Input
          placeholder="search account..."
          type="search"
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
        />

        <Select
          value={sortByState}
          onValueChange={(v) => setSortByState(v as AccountSoryByParam)}
        >
          <SelectTrigger className="w-[180px]">
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

        <Select
          value={typeState}
          onValueChange={(v) => setTypeState(v as AccountTypeParam)}
        >
          <SelectTrigger className="w-[180px]">
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

        <Button type="button" onClick={handleSortOrderState} size={"icon"}>
          <ArrowUpDown />
        </Button>
      </div>

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
                    className="bg-radial-[at_25%_25%]  from-muted from-50% to-primary/10 shadow-xl hover:scale-101 transition-all hover:from-5% ease-in-out"
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
                      <CardAction>
                        <Button
                          size={"icon"}
                          onClick={() => alert(item.id)}
                          className="rounded-full p-1"
                        >
                          <Pencil className="" />
                        </Button>
                      </CardAction>
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
      <div className="flex items-center">
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
        <Select
          value={limitState.toString()}
          onValueChange={(v) => setLimitState(Number(v))}
        >
          <SelectTrigger className="w-[180px]">
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
      </div>
    </section>
  );
}

const Container = ({ children }: ChildrenProps) => {
  return (
    <section className="grid grid-cols-1 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:grid-cols-2 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3  px-4 py-6 gap-4">
      {children}
    </section>
  );
};
