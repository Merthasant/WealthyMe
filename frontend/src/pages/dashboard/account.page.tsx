import AccountDataContainer from "@/components/organisms/account/account-data-container";
import AccountFilters from "@/components/organisms/account/account-filters";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllAccount } from "@/lib/queries/account.query";
import {
  getAccountSoryByParam,
  getAccountTypeParam,
  getNumberParam,
  getSortOrderParam,
} from "@/lib/utils/get-params.utils";
import { useUpdateSearchParams } from "@/lib/utils/set-params.utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function AccountPage() {
  const [searchParams] = useSearchParams();

  // update bulk params
  const updateParams = useUpdateSearchParams();

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

      <AccountDataContainer
        accountsData={data.data}
        isLoading={isLoading}
        // handleOpenAccountDetail={handleOpenAccountDetail}
      />

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
