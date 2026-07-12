import type { ChildrenProps } from "@/lib/types/components.type";

export default function AuthContainer({ children }: ChildrenProps) {
  return (
    <section className="w-full h-full flex items-center justify-center">
      {children}
    </section>
  );
}
