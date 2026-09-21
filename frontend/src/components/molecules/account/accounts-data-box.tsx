import type { ChildrenProps } from "@/lib/types/components.type";

export default function AccountsDataBox({ children }: ChildrenProps) {
  return (
    <section className="grid grid-cols-1 group-has-data-[collapsible=icon]/sidebar-wrapper:sm:grid-cols-2 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {children}
    </section>
  );
}
