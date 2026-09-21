import { DynamicIcon } from "@/components/dynamic-icon";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Accounts } from "@/lib/types/account.type";
import { formatCurrency } from "@/lib/utils/currency-format.utils";
import { getAccountIcon } from "@/lib/utils/get-account-icon.utils";

interface AccountCardProps {
  data: Accounts;
  onClick?: () => void;
}

export default function AccountCard({ data, onClick }: AccountCardProps) {
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
        <CardDescription className="mt-3">
          <p className="text-accent-foreground/20 font-bold"> BALANCE: </p>
          <p className="text-2xl text-foreground font-bold truncate mt-3">
            {formatCurrency(data.balance, data.currency_code)}
          </p>
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
}
