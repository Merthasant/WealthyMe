import CreateAccountBtn from "@/components/molecules/account/add-account-btn";
import { Button } from "@/components/ui/button";
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
import type { ChildrenProps } from "@/lib/types/components.type";
import type {
  AccountOptionParams,
  AccountSoryByParam,
  AccountTypeParam,
  SortOrderParam,
} from "@/lib/types/options-param";
import { cn } from "@/lib/utils";
import { useUpdateSearchParams } from "@/lib/utils/set-params.utils";
import { ArrowUpDown, Search } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { useDebounce } from "use-debounce";

interface AccountFiltersProps {
  queryKeyAllAccounts: AccountOptionParams;
}

export default function AccountFilters({
  queryKeyAllAccounts,
}: AccountFiltersProps) {
  const updateParams = useUpdateSearchParams();

  const { search, page, limit, sortBy, sortOrder, type } = queryKeyAllAccounts;

  // search Query
  const [searchState, setSearchState] = useState<string>(search);
  const [searchDebounce] = useDebounce(searchState, 1000);

  // sort by query
  const [sortByState, setSortByState] = useState<AccountSoryByParam>(sortBy);

  // sort order query
  const [sortOrderState, setSortOrderState] =
    useState<SortOrderParam>(sortOrder);
  const [isAsc, setIsAsc] = useState<boolean>(true);

  const handleSortOrderState = () => {
    setIsAsc(() => !isAsc);
    if (isAsc) setSortOrderState("asc");
    else setSortOrderState("desc");
  };

  // type query
  const [typeState, setTypeState] = useState<AccountTypeParam>(type);

  // limit,search,sortBy,sortOrder,type watcher
  useEffect(() => {
    updateParams({
      search: searchDebounce,
      sortBy: sortByState,
      sortOrder: sortOrderState,
      type: typeState,
      page: null,
    });
  }, [updateParams, searchDebounce, sortByState, sortOrderState, typeState]);

  return (
    <FiltersContainer>
      <AccountFilter className="col-span-12 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-6 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:col-span-4 lg:col-span-6 xl:col-span-4">
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
      </AccountFilter>

      <AccountFilter className="col-span-6 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-3 lg:col-span-3">
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
      </AccountFilter>

      <AccountFilter className="col-span-5 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:col-span-2 lg:col-span-2">
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
      </AccountFilter>

      <AccountFilter className="col-span-1 place-items-center group-has-data-[collapsible=icon]/sidebar-wrapper:place-items-start lg:place-items-start mt-auto">
        <Button type="button" onClick={handleSortOrderState} size={"icon-lg"}>
          <ArrowUpDown />
        </Button>
      </AccountFilter>

      <CreateAccountBtn
        queryKeyAllAccounts={{ page, limit, search, sortBy, sortOrder, type }}
      />
    </FiltersContainer>
  );
}

const FiltersContainer = ({ children }: ChildrenProps) => {
  return (
    <section className="grid grid-cols-12 items-center gap-4 py-4 *:flex *:flex-col *:gap-2">
      {children}
    </section>
  );
};

type AccountFilterProps = ChildrenProps & ComponentProps<"div">;

const AccountFilter = ({
  children,
  className,
  ...props
}: AccountFilterProps) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};
