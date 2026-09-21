import AccountCard from "@/components/molecules/account/account-card";
import AccountsDataBox from "@/components/molecules/account/accounts-data-box";
import { Skeleton } from "@/components/ui/skeleton";
import type { Accounts } from "@/lib/types/account.type";

interface AccountDataContainerProps {
  isLoading: boolean;
  accountsData: Accounts[];
  // handleOpenAccountDetail: (accountId: string) => void;
}

export default function AccountDataContainer({
  isLoading,
  accountsData,
  // handleOpenAccountDetail,
}: AccountDataContainerProps) {
  return (
    <section className="group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-[79vh] min-h-[76vh] px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/20 scrollbar-track-transparent">
      {isLoading ? (
        <AccountsDataBox>
          {Array(12)
            .fill(null)
            .map((_, index) => (
              <Skeleton id={index.toString()} />
            ))}
        </AccountsDataBox>
      ) : (
        <>
          {accountsData && accountsData[0] ? (
            <AccountsDataBox>
              {accountsData.map((item) => (
                <AccountCard
                  key={item.id}
                  data={item}
                  // onClick={() => handleOpenAccountDetail(item.id)}
                />
              ))}
            </AccountsDataBox>
          ) : (
            <h1>empty</h1>
          )}
        </>
      )}
    </section>
  );
}
