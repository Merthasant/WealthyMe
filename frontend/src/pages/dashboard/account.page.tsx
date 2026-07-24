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
import { useGetAllAccount } from "@/lib/queries/account.query";
import { formatCurrency } from "@/lib/utils/currency-format.utils";
import { getAccountIcon } from "@/lib/utils/get-account-icon.utils";
import { Pencil } from "lucide-react";

export default function AccountPage() {
  const { data, isLoading, isError } = useGetAllAccount();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>error</h1>;

  return (
    <section className="flex flex-col">
      <div className="px-4">
        <Input placeholder="search account..." type="search" />
      </div>
      <div className="grid grid-cols-1 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:grid-cols-2 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3  px-4 py-6 gap-4">
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
      </div>
    </section>
  );
}
