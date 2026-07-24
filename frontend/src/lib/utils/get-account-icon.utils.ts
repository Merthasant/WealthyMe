import type { IconName } from "../../components/dynamic-icon";
import type { AccountType } from "../types/account.type";

// Mapping tipe akun ke NAMA icon (bukan component), dipakai bareng <DynamicIcon />
const ACCOUNT_ICON: Record<AccountType, IconName> = {
  cash: "Banknote",
  e_wallet: "Wallet",
  bank: "Landmark",
  investment: "TrendingUp",
};

function getAccountIcon(accountType: AccountType): IconName {
  return ACCOUNT_ICON[accountType];
}

// Contoh pemakaian di komponen:
// <DynamicIcon name={getAccountIcon("bank")} size={20} />

export { getAccountIcon };
export type { AccountType };
