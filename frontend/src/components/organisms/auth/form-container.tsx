import type { ChildrenProps } from "@/lib/types/components.type";

export default function AuthFormContainer({ children }: ChildrenProps) {
  return (
    <section className="py-10 sm:max-w-md w-full md:w-1/2 px-6 ">
      {children}
    </section>
  );
}
