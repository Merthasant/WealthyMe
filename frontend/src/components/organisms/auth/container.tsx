import type { ChildrenProps } from "./auth.organism.type";

export default function AuthContainer({ children }: ChildrenProps) {
  return (
    <section className="w-full h-full flex items-center justify-center">
      {children}
    </section>
  );
}
